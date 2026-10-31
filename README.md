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

## 📱 Responsive design states

- **Mobile (<768px):** The learning card stays central and dominant. Categories remain a single, touch-friendly horizontal rail so long translations do not force a crowded wrap. Settings opens beside its 48px control and all controls use at least 44px touch targets.
- **Desktop (≥768px):** The app uses a centered, wider frame; category choices wrap into a calm row above the card, while the next action remains directly below the learning content.

The visual hierarchy is intentional: category selection is quiet, the learning card is the primary surface, audio controls are secondary actions within it, and the next button is the single primary action.

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

- [Node.js](https://nodejs.org/) (v24)
- [pnpm](https://pnpm.io/) (v9.15.9; enabled automatically through the `packageManager` field)

### Install & Run

```bash
# Install dependencies
pnpm install

# Start the dev server
pnpm dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm build
pnpm preview   # preview the production build locally
```

Run the fast validation checks before opening a pull request:

```bash
pnpm lint
pnpm test -- --run
pnpm build
```

## 📁 Project Structure

```
AlphaFun/
├── index.html              # App shell & UI markup
├── vite.config.js          # Vite + PWA plugin config
├── package.json
├── public/
│   ├── alphafun-icon.svg   # App icon
│   ├── alphafun-icon.svg   # PWA icon
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

The image migration and before/after byte counts are recorded in
[`docs/image-optimization.md`](docs/image-optimization.md).

## ☁️ Deployment

The app is deployed as an **Azure Static Web App** via GitHub Actions.

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `deploy.yml` | Push / PR | Build & deploy to Azure Static Web Apps |
| `infrastructure.yml` | Manual | Provision Azure resources via Terraform |

## 📄 License

This project is private.
