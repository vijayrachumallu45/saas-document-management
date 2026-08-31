# DocFlow — Document Management Demo

A clean, modern **Document Management** web application built with pure **HTML, CSS, and JavaScript**.

## Features

- Login / Register / Logout (client-side demo authentication)
- Dashboard with stats (total docs, recent uploads, shared, storage)
- Documents list with filter, sort, list/grid view, search
- Upload with drag & drop + progress simulation
- Rename, Preview, Delete (moves to Trash)
- Trash with Restore / Permanent delete
- Shared section (placeholder)
- Settings (profile name)
- Fully responsive design
- Attractive modern SaaS-style UI

## Installation

No external dependencies are required to run the UI.

If you have Node.js (≥16):

```bash
# optional — only needed for the npm scripts
npm install
```

(There are no runtime npm packages; the project is pure static files.)

## Run

### Option A — npm script (recommended)
```bash
npm start
```
Opens a local server at http://localhost:8080

### Option B — Python
```bash
python -m http.server 8080
```
Then open http://localhost:8080

### Option C — Direct open
Double-click `index.html` (some browsers limit localStorage on `file://`).

## Demo Login
Use **any email** and **any password**. Authentication is simulated with localStorage.

## Tests

```bash
npm test
```

Or run individually:
```bash
node tests/auth.test.js
node tests/app.test.js
```

## Project Structure
```
docmanage/
├── index.html          # Login / Register
├── dashboard.html      # Main application
├── css/style.css
├── js/auth.js
├── js/app.js
├── tests/
│   ├── auth.test.js
│   └── app.test.js
├── package.json
└── README.md
```

## Dependencies
None for runtime. Optional Node.js for `npm start` and tests.

## License
UNLICENSED — Proprietary / private use. No open-source license is applied.

## Notes
- Data is stored in the browser’s localStorage only.
- No API keys, no backend, no external services required (except optional Google Fonts).
- This is a frontend prototype / demo, not a production enterprise system.
