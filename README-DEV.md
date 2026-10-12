# SplitSpot - Development Setup

## Quick Start Commands

### 1. Check Prerequisites
```powershell
# Check Node.js
node --version

# Check npm
npm --version
```
**Required:** Node.js 18+ and npm 9+

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start Development Server
```powershell
npm run dev
```

### 4. Open in Browser
```
http://localhost:3000
```

---

## All-in-One Setup & Run

Paste this entire block into PowerShell:

```powershell
# Prerequisites Check
node --version; npm --version

# Install & Run
npm install; npm run dev
```

---

## Troubleshooting

**Port 3000 in use:**
```powershell
# Find and kill the process
netstat -ano | findstr :3000
taskkill /PID <PROCESS_ID> /F

# Or use a different port
npm run dev -- -p 3001
```

**Clean rebuild:**
```powershell
rm -rf node_modules .next
npm install
npm run dev
```

---

## Scripts Available

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
