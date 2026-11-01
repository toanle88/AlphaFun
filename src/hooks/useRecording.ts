import { useState, useCallback, useEffect, useRef } from 'react'

export type RecordingError = 'permission-denied' | 'unsupported' | 'unknown'

const stopStream = (stream: MediaStream | null | undefined) => {
  if (!stream) {
    return
  }

  let tracks: MediaStreamTrack[]
  try {
    tracks = stream.getTracks()
  } catch {
    return
  }

  tracks.forEach((track) => {
    try {
      track.stop()
    } catch {
      // Continue stopping the remaining tracks if one track fails.
    }
  })
}

const stopRecorder = (mediaRecorder: MediaRecorder) => {
  try {
    if (mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
    }
  } catch {
    // Cleanup must still release the stream if the recorder is already closing.
  } finally {
    try {
      stopStream(mediaRecorder.stream)
    } catch {
      // Some test doubles and partially initialized recorders may not expose a stream.
    }
  }
}

export const useRecording = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPermissionRequesting, setIsPermissionRequesting] = useState(false)
  const [error, setError] = useState<RecordingError | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioUrlRef = useRef<string | null>(null)
  const recordingIdRef = useRef(0)
  const isRecordingRef = useRef(false)
  const mountedRef = useRef(true)
  const isPermissionRequestingRef = useRef(false)

  const revokeAudioUrl = useCallback(() => {
    const url = audioUrlRef.current
    if (!url) {
      return
    }

    try {
      URL.revokeObjectURL(url)
    } catch {
      // Continue clearing the reference even if the browser rejects the URL.
    } finally {
      audioUrlRef.current = null
    }
    if (mountedRef.current) {
      setAudioUrl(null)
    }
  }, [])

  const cleanupRecording = useCallback(() => {
    // Invalidate pending onstop callbacks before stopping the recorder.
    recordingIdRef.current += 1
    const mediaRecorder = mediaRecorderRef.current
    mediaRecorderRef.current = null
    audioChunksRef.current = []
    isRecordingRef.current = false
    isPermissionRequestingRef.current = false
    revokeAudioUrl()

    if (mediaRecorder) {
      stopRecorder(mediaRecorder)
    }
    if (mountedRef.current) {
      setIsRecording(false)
      setIsPermissionRequesting(false)
      setError(null)
    }
  }, [revokeAudioUrl])

  const startRecording = useCallback(async () => {
    if (isPermissionRequestingRef.current || isRecordingRef.current) {
      return
    }

    // Starting another recording explicitly replaces the previous recording.
    cleanupRecording()
    setError(null)
    isPermissionRequestingRef.current = true
    setIsPermissionRequesting(true)
    const recordingId = recordingIdRef.current + 1
    recordingIdRef.current = recordingId
    let stream: MediaStream | null = null
    let mediaRecorder: MediaRecorder | null = null
    let recordingError: RecordingError = 'unknown'

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        recordingError = 'unsupported'
        throw new Error('Microphone APIs are unavailable')
      }

      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      if (!mountedRef.current || recordingIdRef.current !== recordingId) {
        stopStream(stream)
        return
      }

      if (typeof MediaRecorder === 'undefined') {
        recordingError = 'unsupported'
        throw new Error('MediaRecorder is unavailable')
      }

      mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (mountedRef.current && recordingIdRef.current === recordingId) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        if (!mountedRef.current || recordingIdRef.current !== recordingId) {
          return
        }

        const chunks = audioChunksRef.current
        audioChunksRef.current = []
        const mimeType = mediaRecorder?.mimeType || chunks.find((chunk) => chunk.type)?.type
        const audioBlob = new Blob(chunks, mimeType ? { type: mimeType } : undefined)
        const url = URL.createObjectURL(audioBlob)
        audioUrlRef.current = url
        setAudioUrl(url)

        const audio = new Audio(url)
        const playPromise = audio.play()
        if (playPromise) {
          playPromise.catch(() => undefined)
        }
      }

      mediaRecorder.start()
      isRecordingRef.current = true
      setIsRecording(true)
    } catch (err) {
      const isCurrentRecording = recordingIdRef.current === recordingId
      if (isCurrentRecording) {
        recordingIdRef.current += 1
        mediaRecorderRef.current = null
        audioChunksRef.current = []
        isRecordingRef.current = false
        if (mountedRef.current) {
          setIsRecording(false)
          isPermissionRequestingRef.current = false
          setIsPermissionRequesting(false)
        }
      }

      if (mediaRecorder) {
        stopRecorder(mediaRecorder)
      } else if (stream) {
        stopStream(stream)
      }

      if (recordingError === 'unknown' && err instanceof DOMException) {
        recordingError =
          err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
            ? 'permission-denied'
            : 'unknown'
      }
      console.error('Microphone access denied:', err)
      if (mountedRef.current && isCurrentRecording) {
        setError(recordingError)
      }
    } finally {
      if (mountedRef.current && recordingIdRef.current === recordingId) {
        isPermissionRequestingRef.current = false
        setIsPermissionRequesting(false)
      }
    }
  }, [cleanupRecording])

  const stopRecording = useCallback(() => {
    const mediaRecorder = mediaRecorderRef.current
    if (mediaRecorder && isRecordingRef.current) {
      mediaRecorderRef.current = null
      isRecordingRef.current = false
      if (mountedRef.current) {
        setIsRecording(false)
      }
      stopRecorder(mediaRecorder)
    }
  }, [])

  const playRecording = useCallback(() => {
    if (audioUrlRef.current) {
      const audio = new Audio(audioUrlRef.current)
      audio.play()
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      isPermissionRequestingRef.current = false
      cleanupRecording()
    }
  }, [cleanupRecording])

  return {
    isRecording,
    isPermissionRequesting,
    error,
    audioUrl,
    startRecording,
    stopRecording,
    playRecording,
    cleanupRecording,
  }
}
