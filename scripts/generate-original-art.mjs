import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const root = process.cwd()
const imageDir = join(root, 'public/images')
const palette = {
  coral: '#ff6f61',
  orange: '#ff9f43',
  yellow: '#ffd166',
  teal: '#43c6b9',
  blue: '#3b82c4',
  navy: '#26364a',
  green: '#70b85a',
  leaf: '#2f9b70',
  cream: '#fff8e9',
  ink: '#26364a',
  brown: '#81513c',
  lavender: '#a77be8',
  pink: '#f7a2a7',
  white: '#fffdf8',
}

const defs = `
  <defs>
    <linearGradient id="coral" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff8a70"/><stop offset="1" stop-color="#f4515e"/>
    </linearGradient>
    <linearGradient id="teal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#64d4c7"/><stop offset="1" stop-color="#299db2"/>
    </linearGradient>
    <linearGradient id="blue" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#5eadd8"/><stop offset="1" stop-color="#3474bd"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="8" flood-color="#26364a" flood-opacity=".13"/>
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
  </defs>`

const svg = (
  width,
  height,
  body,
  { background = true } = {},
) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
${defs}
${background ? `<rect width="${width}" height="${height}" rx="44" fill="${palette.cream}"/>` : ''}
${body}
</svg>`

const objectBackdrop = `
  <circle cx="72" cy="106" r="28" fill="#ffd166" opacity=".48"/>
  <circle cx="440" cy="160" r="38" fill="#a77be8" opacity=".25"/>
  <path d="M30 610c86-48 140-36 205-3 75 38 142 45 247-15v171H30z" fill="#e2f3df"/>
  <path d="M0 700c104-31 166-28 258 8 92 36 167 26 254-12v67H0z" fill="#d2eee9" opacity=".7"/>
  <ellipse cx="256" cy="645" rx="152" ry="22" fill="#26364a" opacity=".12" filter="url(#soft)"/>`

const verbBackdrop = `
  <circle cx="94" cy="94" r="38" fill="#ffd166" opacity=".42"/>
  <circle cx="430" cy="112" r="48" fill="#a77be8" opacity=".22"/>
  <path d="M24 438c82-44 145-38 229-5 78 31 144 38 235-14v93H24z" fill="#d7f0e8"/>
  <ellipse cx="256" cy="458" rx="150" ry="19" fill="#26364a" opacity=".12" filter="url(#soft)"/>`

const face = (x, y, scale = 1, expression = 'happy') => {
  const mouth =
    expression === 'surprised'
      ? `<ellipse cx="${x + 23 * scale}" cy="${y + 33 * scale}" rx="8" ry="11" fill="${palette.ink}"/>`
      : expression === 'sad'
        ? `<path d="M${x + 13 * scale} ${y + 40 * scale}q10-12 20 0" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>`
        : `<path d="M${x + 12 * scale} ${y + 31 * scale}q11 16 22 0" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>`
  return `<path d="M${x + 9 * scale} ${y + 19 * scale}q5-7 11 0M${x + 28 * scale} ${y + 19 * scale}q5-7 11 0" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    ${mouth}<circle cx="${x + 11 * scale}" cy="${y + 29 * scale}" r="${5 * scale}" fill="#f7a2a7" opacity=".8"/><circle cx="${x + 37 * scale}" cy="${y + 29 * scale}" r="${5 * scale}" fill="#f7a2a7" opacity=".8"/>`
}

const apple = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M257 267c-25-52 8-82 38-96" stroke="${palette.brown}" stroke-width="18" stroke-linecap="round"/>
    <path d="M284 181c50-43 108-23 126 9-46 33-88 30-126-9Z" fill="${palette.leaf}"/>
    <path d="M256 246c-68-41-158 17-145 130 12 107 83 170 145 170s133-63 145-170c13-113-77-171-145-130Z" fill="url(#coral)"/>
    <path d="M167 302c-12 49-5 96 21 128" stroke="#ffb18e" stroke-width="13" stroke-linecap="round" opacity=".65"/>
    <path d="M228 349q13-18 26 0M282 349q13-18 26 0" stroke="${palette.ink}" stroke-width="7" stroke-linecap="round"/>
    ${face(218, 352, 1.05)}
  </g>`,
)

const car = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M96 492h320v98H96z" rx="25" fill="${palette.coral}"/>
    <path d="M145 492c28-83 60-118 112-118h55c49 0 77 35 105 118H145Z" fill="${palette.orange}"/>
    <path d="M174 478c19-52 40-70 77-70h26v70H174ZM295 408h18c35 0 57 19 76 70H295v-70Z" fill="#c8edeb" opacity=".9"/>
    <circle cx="169" cy="590" r="43" fill="${palette.navy}"/><circle cx="169" cy="590" r="20" fill="#d8e1e7"/>
    <circle cx="343" cy="590" r="43" fill="${palette.navy}"/><circle cx="343" cy="590" r="20" fill="#d8e1e7"/>
    <path d="M117 522h24M371 522h24" stroke="#fff5d8" stroke-width="12" stroke-linecap="round"/>
    <circle cx="256" cy="532" r="10" fill="${palette.yellow}"/>
  </g>`,
)

const dog = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M128 522c-18-76 16-161 113-162 95-1 145 63 132 148-12 83-93 111-172 90-37-10-66-35-73-76Z" fill="#f2be76"/>
    <path d="M142 396c-52-83 4-126 59-68 18 19 30 42 33 66l-44 26-48-24ZM369 397c51-81 2-130-56-70-18 19-29 41-32 66l42 29 46-25Z" fill="${palette.brown}"/>
    <ellipse cx="220" cy="451" rx="27" ry="39" fill="${palette.brown}"/><ellipse cx="300" cy="451" rx="27" ry="39" fill="${palette.brown}"/>
    ${face(215, 436, 1.15)}
    <ellipse cx="256" cy="486" rx="16" ry="12" fill="${palette.ink}"/>
    <path d="M248 500q8 15 16 0" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    <path d="M170 560q-36 39-42 74M342 560q36 39 42 74" stroke="#f2be76" stroke-width="28" stroke-linecap="round"/>
    <path d="M337 591q57-49 96-7" stroke="${palette.coral}" stroke-width="12" stroke-linecap="round"/>
  </g>`,
)

const bird = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <ellipse cx="255" cy="425" rx="134" ry="150" fill="${palette.yellow}"/>
    <path d="M154 416c-68-80-73-7-46 33 21 31 50 53 78 57" fill="${palette.orange}"/>
    <path d="M356 416c68-80 73-7 46 33-21 31-50 53-78 57" fill="${palette.orange}"/>
    <path d="m365 444 45 21-45 21Z" fill="${palette.coral}"/>
    ${face(218, 405, 1.1)}
    <path d="M230 545v42M281 545v42M215 587h31M266 587h31" stroke="${palette.orange}" stroke-width="13" stroke-linecap="round"/>
  </g>`,
)

const sun = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M256 214v-55M256 603v-55M99 406H44M468 406h-55M145 296l-39-39M367 516l39 39M367 296l39-39M145 516l-39 39" stroke="${palette.yellow}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="256" cy="406" r="142" fill="url(#coral)"/>
    ${face(210, 365, 1.25)}
  </g>`,
)

const banana = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M135 305c54 163 157 229 280 145 32-22 51-50 57-82 9 97-70 178-166 176-104-3-173-86-171-239Z" fill="${palette.yellow}" stroke="#e7a62c" stroke-width="10"/>
    <path d="M132 305q-21-29 4-46M475 368q29-13 34-39" stroke="${palette.brown}" stroke-width="17" stroke-linecap="round"/>
    <path d="M172 334c37 93 93 143 175 139" stroke="#fff1a4" stroke-width="13" stroke-linecap="round" opacity=".85"/>
    ${face(255, 385, 0.85)}
  </g>`,
)

const cat = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M159 350 150 220l94 73h25l94-73-9 130c-4 107-54 166-98 166s-94-59-97-166Z" fill="${palette.orange}"/>
    <path d="m163 255 18 93 58-42M349 255l-18 93-58-42" fill="#ffd9a0"/>
    <path d="M189 410q-17 47 8 78M323 410q17 47-8 78" stroke="#fff0cf" stroke-width="18" stroke-linecap="round"/>
    ${face(216, 386, 1.1)}
    <path d="M256 435q11 11 22 0" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    <path d="M198 448 112 430M198 465 107 473M314 448l86-18M314 465l91 8" stroke="${palette.ink}" stroke-width="5" stroke-linecap="round"/>
    <path d="M352 560q121 18 59-94" stroke="${palette.orange}" stroke-width="28" stroke-linecap="round"/>
  </g>`,
)

const house = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M103 425 256 275l153 150v190H103z" fill="#fff0c2"/>
    <path d="m78 437 178-178 178 178-31 27L256 320 109 464Z" fill="${palette.coral}"/>
    <path d="M212 615V496h88v119" fill="${palette.blue}"/>
    <circle cx="276" cy="557" r="8" fill="${palette.yellow}"/>
    <path d="M147 441h72v-68h-72zM293 441h72v-68h-72z" fill="#9fd9d5" stroke="${palette.white}" stroke-width="10"/>
    <path d="M183 373v68M329 373v68M147 407h72M293 407h72" stroke="${palette.white}" stroke-width="8"/>
    <path d="M377 309v-73h49v73" fill="${palette.brown}"/>
  </g>`,
)

const ball = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <circle cx="256" cy="410" r="150" fill="${palette.teal}"/>
    <path d="M151 316q90 48 210 0M151 504q90-48 210 0M256 260q-31 76 0 150t0 150" stroke="${palette.white}" stroke-width="13" opacity=".9" fill="none"/>
    ${face(218, 378, 1)}
  </g>`,
)

const flower = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M256 454v148" stroke="${palette.leaf}" stroke-width="18" stroke-linecap="round"/>
    <path d="M249 536q-61-50-99 15 63 35 106 12M269 568q59-47 92 15-58 31-96 10" fill="${palette.green}"/>
    <circle cx="256" cy="330" r="56" fill="${palette.yellow}"/>
    <circle cx="256" cy="235" r="70" fill="${palette.coral}"/><circle cx="158" cy="300" r="70" fill="${palette.coral}"/><circle cx="354" cy="300" r="70" fill="${palette.coral}"/>
    <circle cx="177" cy="392" r="70" fill="${palette.orange}"/><circle cx="335" cy="392" r="70" fill="${palette.orange}"/>
    ${face(232, 312, 0.55)}
  </g>`,
)

const fish = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M130 412q84-133 247 0-163 133-247 0Z" fill="url(#blue)"/>
    <path d="M372 412 465 329v166z" fill="${palette.orange}"/>
    <circle cx="213" cy="379" r="13" fill="${palette.white}"/><circle cx="213" cy="379" r="6" fill="${palette.ink}"/>
    <path d="M262 403q34 27 66 0" stroke="${palette.white}" stroke-width="7" stroke-linecap="round"/>
    <path d="M287 316q-33-65-70-69M287 508q-33 65-70 69" stroke="${palette.blue}" stroke-width="20" stroke-linecap="round"/>
  </g>`,
)

const tree = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M229 460h56v160h-56z" fill="${palette.brown}"/>
    <path d="M256 500 166 420h52l-68-76h79l-29-86h112l-29 86h79l-68 76h52z" fill="${palette.leaf}"/>
    <circle cx="256" cy="248" r="108" fill="#73c45e"/><circle cx="165" cy="339" r="92" fill="#4bab6c"/><circle cx="347" cy="339" r="92" fill="#4bab6c"/>
    <path d="M198 573h116" stroke="${palette.brown}" stroke-width="20" stroke-linecap="round"/>
    <circle cx="217" cy="221" r="17" fill="#a5d35e"/><circle cx="305" cy="301" r="20" fill="#a5d35e"/><circle cx="172" cy="358" r="15" fill="#a5d35e"/>
  </g>`,
)

const book = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M118 303q72-36 138 17v245q-66-52-138-16z" fill="${palette.coral}"/>
    <path d="M394 303q-72-36-138 17v245q66-52 138-16z" fill="${palette.teal}"/>
    <path d="M256 320v246" stroke="${palette.white}" stroke-width="8"/>
    <path d="M158 353q43-14 78 5M158 391q43-14 78 5M354 353q-43-14-78 5M354 391q-43-14-78 5" stroke="#fff4cf" stroke-width="9" stroke-linecap="round"/>
  </g>`,
)

const hat = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M146 439c0-116 43-180 110-180s110 64 110 180H146Z" fill="${palette.blue}"/>
    <path d="M105 431q151-57 302 0 30 12 0 39-151 41-302 0-30-12 0-39Z" fill="${palette.coral}"/>
    <path d="M215 271q41-36 82 0" stroke="${palette.yellow}" stroke-width="17" stroke-linecap="round"/>
    <circle cx="256" cy="300" r="15" fill="${palette.yellow}"/>
  </g>`,
)

const orange = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <circle cx="256" cy="407" r="143" fill="${palette.orange}"/>
    <path d="M256 265q5-55 45-61" stroke="${palette.brown}" stroke-width="16" stroke-linecap="round"/>
    <path d="M300 205q62-32 94 14-55 37-94-14Z" fill="${palette.leaf}"/>
    <path d="M187 336q68-42 138 0M181 391q75-44 150 0M191 449q66-39 130 0" stroke="#ffd166" stroke-width="10" stroke-linecap="round" opacity=".8"/>
    ${face(218, 390, 1.1)}
  </g>`,
)

const rabbit = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M190 318c-42-125 8-151 46-22M322 296c38-126-14-151-49-24" fill="#f6d5ca" stroke="${palette.coral}" stroke-width="16" stroke-linecap="round"/>
    <ellipse cx="256" cy="435" rx="132" ry="150" fill="#f6d5ca"/>
    ${face(216, 410, 1.1)}
    <ellipse cx="256" cy="471" rx="16" ry="12" fill="${palette.coral}"/>
    <path d="M223 520q33 25 66 0" stroke="${palette.coral}" stroke-width="7" stroke-linecap="round"/>
    <path d="M160 535q-35 58-5 97M352 535q35 58 5 97" stroke="#f6d5ca" stroke-width="31" stroke-linecap="round"/>
  </g>`,
)

const moon = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <circle cx="250" cy="406" r="145" fill="#273f86"/>
    <circle cx="292" cy="365" r="126" fill="${palette.yellow}"/>
    <circle cx="336" cy="321" r="126" fill="#273f86"/>
    <circle cx="189" cy="321" r="7" fill="${palette.white}"/><circle cx="379" cy="438" r="8" fill="${palette.white}"/><circle cx="210" cy="490" r="6" fill="${palette.white}"/>
    ${face(259, 394, 0.85)}
  </g>`,
)

const star = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="m256 241 39 91 98 9-75 64 23 96-85-51-85 51 23-96-75-64 98-9z" fill="${palette.yellow}" stroke="${palette.orange}" stroke-width="12" stroke-linejoin="round"/>
    ${face(232, 375, 0.55)}
  </g>`,
)

const table = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M88 332h336l-34 68H122z" fill="${palette.coral}"/>
    <path d="M139 400h30v201h-30zM343 400h30v201h-30z" fill="${palette.brown}"/>
    <path d="M110 592h94M308 592h94" stroke="${palette.brown}" stroke-width="18" stroke-linecap="round"/>
    <circle cx="200" cy="295" r="46" fill="${palette.yellow}"/><path d="M200 341v-53" stroke="${palette.leaf}" stroke-width="9"/>
  </g>`,
)

const chair = svg(
  512,
  763,
  `${objectBackdrop}
  <g filter="url(#shadow)">
    <path d="M150 262h212v181H150z" fill="${palette.blue}"/>
    <path d="M130 428h252v58H130z" fill="${palette.coral}"/>
    <path d="M155 486v125M357 486v125" stroke="${palette.brown}" stroke-width="24" stroke-linecap="round"/>
    <path d="M169 285v131M343 285v131" stroke="#c8edeb" stroke-width="9" opacity=".7"/>
  </g>`,
)

const person = (pose = 'stand', expression = 'happy') => {
  const poses = {
    jump: `<path d="M201 291 132 215M312 291l73-79M219 409l-68 92M293 409l73 92" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    run: `<path d="M211 299 130 336M306 297l84 18M221 405l-87 52M299 406l78 54" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    walk: `<path d="M211 299 137 352M306 297l65 47M229 408l-44 91M290 408l56 91" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    laugh: `<path d="M211 296 142 252M308 296l72-42M222 406l-47 105M297 406l55 105" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    cry: `<path d="M211 296 145 352M309 296l65 56M222 408l-45 104M296 408l48 104" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    read: `<path d="M215 295 147 340M304 295l63 45M224 411l-45 104M296 411l45 104" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    write: `<path d="M210 294 144 346M309 294l68 52M224 410l-48 105M296 410l50 105" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    sing: `<path d="M210 297 140 254M309 297l73-43M223 409l-46 105M296 409l49 105" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    swim: `<path d="M210 294 143 344M308 294l68 50M219 407l-72 45M299 407l76 45" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    clap: `<path d="M211 294 172 235M309 294l42-59M225 409l-44 105M296 409l45 105" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
    dance: `<path d="M211 294 135 235M309 294l79-58M223 409l-84 82M296 409l83 82" stroke="${palette.ink}" stroke-width="18" stroke-linecap="round"/>`,
  }
  const mouth = expression === 'sad' ? 'sad' : expression === 'surprised' ? 'surprised' : 'happy'
  return `<g filter="url(#shadow)">
    ${poses[pose] ?? poses.walk}
    <path d="M203 301q53-32 106 0l-10 116q-44 24-86 0z" fill="${palette.coral}"/>
    <circle cx="256" cy="219" r="68" fill="#f4bb83"/>
    <path d="M190 216q3-82 68-80 67 3 64 80-25-38-64-34-41-3-68 34Z" fill="${palette.brown}"/>
    ${face(223, 199, 0.88, mouth)}
    <circle cx="238" cy="284" r="10" fill="${palette.yellow}"/><circle cx="274" cy="284" r="10" fill="${palette.yellow}"/>
  </g>`
}

const verb = (pose, extras = '', expression = 'happy') =>
  svg(512, 512, `${verbBackdrop}${person(pose, expression)}${extras}`)

const assets = {
  'apple.webp': [512, 763, apple],
  'car.webp': [512, 763, car],
  'dog.webp': [512, 763, dog],
  'bird.webp': [512, 763, bird],
  'sun.webp': [512, 763, sun],
  'banana.webp': [512, 763, banana],
  'cat.webp': [512, 763, cat],
  'house.webp': [512, 763, house],
  'ball.webp': [512, 763, ball],
  'flower.webp': [512, 763, flower],
  'fish.webp': [512, 763, fish],
  'tree.webp': [512, 763, tree],
  'book.webp': [512, 763, book],
  'hat.webp': [512, 763, hat],
  'orange.webp': [512, 763, orange],
  'rabbit.webp': [512, 763, rabbit],
  'moon.webp': [512, 763, moon],
  'star.webp': [512, 763, star],
  'table.webp': [512, 763, table],
  'chair.webp': [512, 763, chair],
  'jump.webp': [512, 512, verb('jump')],
  'run.webp': [512, 512, verb('run')],
  'eat.webp': [
    512,
    512,
    verb('read', '<circle cx="349" cy="341" r="30" fill="' + palette.yellow + '"/>'),
  ],
  'drink.webp': [
    512,
    512,
    verb(
      'walk',
      '<path d="M344 300h52l-8 60h-36z" fill="' +
        palette.teal +
        '" stroke="' +
        palette.ink +
        '" stroke-width="8"/>',
    ),
  ],
  'sleep.webp': [
    512,
    512,
    verb(
      'sleep',
      '<path d="M352 128h42M370 108v42" stroke="' +
        palette.lavender +
        '" stroke-width="12" stroke-linecap="round"/>',
      'sad',
    ),
  ],
  'walk.webp': [512, 512, verb('walk')],
  'laugh.webp': [512, 512, verb('laugh')],
  'cry.webp': [
    512,
    768,
    svg(
      512,
      768,
      `${verbBackdrop}${person('cry', 'sad')}<path d="M232 256q-12 34 0 52M280 256q12 34 0 52" stroke="#4aabd1" stroke-width="12" stroke-linecap="round"/>`,
    ),
  ],
  'read.webp': [
    512,
    512,
    verb(
      'read',
      '<path d="M175 335q81-51 162 0v66q-81-51-162 0z" fill="' +
        palette.teal +
        '" stroke="' +
        palette.ink +
        '" stroke-width="8"/>',
    ),
  ],
  'write.webp': [
    512,
    512,
    verb(
      'write',
      '<path d="M322 360 393 290l23 23-71 71-31 8z" fill="' +
        palette.yellow +
        '" stroke="' +
        palette.ink +
        '" stroke-width="7"/>',
    ),
  ],
  'sing.webp': [
    512,
    512,
    verb(
      'sing',
      '<circle cx="365" cy="317" r="25" fill="' +
        palette.orange +
        '" stroke="' +
        palette.ink +
        '" stroke-width="8"/><path d="M365 342v65" stroke="' +
        palette.ink +
        '" stroke-width="8"/>',
    ),
  ],
  'swim.webp': [
    512,
    512,
    verb(
      'swim',
      '<path d="M60 412q50-35 100 0t100 0 100 0 100 0" stroke="' +
        palette.blue +
        '" stroke-width="16" stroke-linecap="round"/>',
    ),
  ],
  'clap.webp': [
    512,
    512,
    verb(
      'clap',
      '<path d="M172 215 143 188M351 215l29-27" stroke="' +
        palette.yellow +
        '" stroke-width="12" stroke-linecap="round"/>',
    ),
  ],
  'dance.webp': [
    512,
    512,
    verb(
      'dance',
      '<path d="M100 158q20-31 40 0M382 158q20-31 40 0" stroke="' +
        palette.orange +
        '" stroke-width="10" stroke-linecap="round"/>',
    ),
  ],
}

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs><linearGradient id="icon" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ff6f61"/><stop offset="1" stop-color="#ff9f43"/></linearGradient></defs>
  <rect width="512" height="512" rx="124" fill="#fff8e9"/>
  <path d="M132 376 225 112q9-25 31-25t31 25l93 264h-67l-20-64H218l-20 64zm103-119h42l-21-76z" fill="url(#icon)" stroke="#26364a" stroke-width="12" stroke-linejoin="round"/>
  <circle cx="108" cy="142" r="28" fill="#43c6b9"/><circle cx="407" cy="149" r="24" fill="#a77be8"/><circle cx="410" cy="382" r="30" fill="#ffd166"/>
  <path d="M115 403q141 54 282 0" stroke="#43c6b9" stroke-width="18" stroke-linecap="round"/>
</svg>`

const render = async () => {
  mkdirSync(imageDir, { recursive: true })
  const launchOptions = { headless: true, args: ['--no-sandbox'] }
  if (process.env.ALPHAFUN_CHROMIUM_PATH) {
    launchOptions.executablePath = process.env.ALPHAFUN_CHROMIUM_PATH
  }
  const browser = await chromium.launch(launchOptions)
  const page = await browser.newPage()
  const provenance = {
    schemaVersion: 2,
    default: {
      creator: 'AlphaFun contributors',
      license: 'MIT',
      attribution: 'AlphaFun contributors',
    },
    assets: {},
  }

  for (const [filename, [width, height, markup]] of Object.entries(assets)) {
    const file = join(imageDir, filename)
    await page.setContent(`<body style="margin:0">${markup}</body>`)
    const data = await page.evaluate(
      async ({ width, height }) => {
        const source = document.querySelector('svg')
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const context = canvas.getContext('2d')
        const blob = await new Promise(
          (resolve) =>
            new XMLSerializer().serializeToString(source) &&
            resolve(
              new Blob([new XMLSerializer().serializeToString(source)], { type: 'image/svg+xml' }),
            ),
        )
        const url = URL.createObjectURL(blob)
        const image = new Image()
        await new Promise((resolve, reject) => {
          image.onload = resolve
          image.onerror = reject
          image.src = url
        })
        context.drawImage(image, 0, 0, width, height)
        URL.revokeObjectURL(url)
        return canvas.toDataURL('image/webp', 0.9).split(',')[1]
      },
      { width, height },
    )
    const bytes = Buffer.from(data, 'base64')
    writeFileSync(file, bytes)
    provenance.assets[`public/images/${filename}`] = {
      sha256: createHash('sha256').update(bytes).digest('hex'),
      source: 'Original AlphaFun artwork authored in scripts/generate-original-art.mjs',
      modifications: `Rasterized to ${width}x${height} WebP for the learning card.`,
    }
  }

  const iconFile = 'public/alphafun-icon.svg'
  const iconBytes = Buffer.from(icon)
  writeFileSync(join(root, iconFile), iconBytes)
  provenance.assets[iconFile] = {
    sha256: createHash('sha256').update(iconBytes).digest('hex'),
    source: 'Original AlphaFun icon artwork authored in scripts/generate-original-art.mjs',
    modifications: 'Source SVG used directly by the browser and as the PNG export source.',
  }
  await page.setContent(`<body style="margin:0">${icon}</body>`)
  for (const size of [192, 512]) {
    const data = await page.evaluate(async (size) => {
      const source = document.querySelector('svg')
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d')
      const blob = new Blob([new XMLSerializer().serializeToString(source)], {
        type: 'image/svg+xml',
      })
      const url = URL.createObjectURL(blob)
      const image = new Image()
      await new Promise((resolve, reject) => {
        image.onload = resolve
        image.onerror = reject
        image.src = url
      })
      context.drawImage(image, 0, 0, size, size)
      URL.revokeObjectURL(url)
      return canvas.toDataURL('image/png').split(',')[1]
    }, size)
    const bytes = Buffer.from(data, 'base64')
    const file = `public/alphafun-icon-${size}.png`
    writeFileSync(join(root, file), bytes)
    provenance.assets[file] = {
      sha256: createHash('sha256').update(bytes).digest('hex'),
      source: 'Original AlphaFun icon artwork authored in scripts/generate-original-art.mjs',
      modifications: `Rasterized to ${size}x${size} PNG for PWA installation.`,
    }
  }

  writeFileSync(join(root, 'asset-provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`)
  await browser.close()
}

render().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
