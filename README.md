# 🎓 AlphaFun — Bé Tập Nói Thật Vui!

A colorful, interactive flashcard PWA that helps young children learn to speak — featuring letters, numbers, objects, colors, actions, and shapes in both **Vietnamese** and **English**.

## ✨ Features

- **6 Learning Categories** — Letters (A–Z), Numbers (1–9), Objects (20 items), Colors (11), Actions (14 verbs), and Shapes (9)
- **Bilingual** — Full Vietnamese 🇻🇳 / English 🇬🇧 support with one-tap switching
- **Text-to-Speech** — Native pronunciation using the Web Speech API
- **Voice Recording** — Kids can record themselves and play it back
- **Auto-play Mode** — Automatically cycles through flashcards with spoken audio
- **Sequential / Random Order** — Choose how items are presented
- **Dynamic Themes** — Each category has its own vibrant color palette
- **PWA** — Installable on mobile devices for an app-like experience
- **Fully Offline** — Works without an internet connection once installed

## 🖼️ Content

| Category | Items |
|----------|-------|
| Chữ cái / Letters | A–Z (26) |
| Chữ số / Numbers | 1–9 (9) |
| Đồ vật / Objects | Apple, Car, Dog, Bird, Sun, Banana, Cat, House, Ball, Flower, Fish, Tree, Book, Hat, Orange, Rabbit, Moon, Star, Table, Chair |
| Màu sắc / Colors | Red, Green, Blue, Yellow, Orange, Pink, Purple, Brown, Black, White, Gray |
| Hành động / Actions | Jump, Run, Eat, Drink, Sleep, Walk, Laugh, Cry, Read, Write, Sing, Dance, Swim, Clap |
| Hình khối / Shapes | Circle, Square, Triangle, Star, Heart, Rectangle, Diamond, Oval, Hexagon |

## 🛠️ Tech Stack

- **Vite** — Lightning-fast dev server & build tool
- **Vanilla JS + CSS** — Zero framework overhead
- **Web Speech API** — Text-to-speech & voice recording
- **vite-plugin-pwa** — Service worker & manifest generation
- **Terraform** — Azure Static Web Apps infrastructure
- **GitHub Actions** — CI/CD deployment pipeline

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)

### Install & Run

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## 📁 Project Structure

```
AlphaFun/
├── index.html              # App shell & UI markup
├── vite.config.js          # Vite + PWA plugin config
├── package.json
├── public/
│   ├── alphafun-icon.svg   # App icon
│   ├── pwa-192x192.png     # PWA icon (192×192)
│   ├── pwa-512x512.png     # PWA icon (512×512)
│   └── images/             # Flashcard images (objects & verbs)
├── src/
│   ├── main.js             # Core app logic & data
│   └── style.css           # All styles & animations
├── infra/                  # Terraform IaC for Azure
│   ├── main.tf
│   ├── providers.tf
│   └── variables.tf
└── .github/workflows/
    ├── deploy.yml           # CI/CD to Azure Static Web Apps
    └── infrastructure.yml   # Terraform provisioning
```

## ☁️ Deployment

The app is deployed as an **Azure Static Web App** via GitHub Actions.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push / PR | Build & deploy to Azure Static Web Apps |
| `infrastructure.yml` | Manual | Provision Azure resources via Terraform |

## 📄 License

This project is private.
