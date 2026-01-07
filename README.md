# API Playground

React project "API Playground" — a simple tool for testing API endpoints with visual feedback for request lifecycle stages, timeouts, and error states.

**Prerequisites**

- Git
- Node.js

**Clone the repository**

```bash
git clone https://github.com/Matuma1ni/API-playground.git
```

**Install dependencies**

```bash
npm install
```

**Run the application (development)**

```bash
npm run dev
```

This starts the Vite dev server (default: http://localhost:5173).

**Build for production**

```bash
npm run build
```

## Mock response mapping

The app maps request paths to mock responses:

- `/success` — 200 OK
- `/not-modified` — 304 Not Modified
- `/not-found` — 404 Not Found
- any other path — simulated timeout (the request will fail with a timeout error)

## Notes

UI components are based on shadcn/ui.
