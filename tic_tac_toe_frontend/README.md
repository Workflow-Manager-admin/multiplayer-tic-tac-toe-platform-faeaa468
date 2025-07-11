# Multiplayer Tic Tac Toe Platform Frontend

This is the React web UI for the multiplayer Tic Tac Toe project. It provides user authentication, live gameplay, match history display, and leaderboard features—all communicating via HTTP with the backend API.

---

## Features

- **Login & Signup**: Secure user registration and authentication.
- **Start / Join Games**: Create games, join other players.
- **Play Tic Tac Toe**: Interactive, real-time board; turn-based logic enforced.
- **Leaderboard**: View top players, updated after each game.
- **Persistent Sessions**: Remembers login using secure cookies.
- **Responsive UI**: Modern, minimal look with easy navigation.

---

## Setup & Installation

### Prerequisites

- Node.js (>=14.x) & npm

### Install Steps

1. Change to the frontend directory:
    ```bash
    cd multiplayer-tic-tac-toe-platform-faeaa468/tic_tac_toe_frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. (Optional) Set up backend URL:
    - By default, the frontend expects the backend at `http://localhost:8000`.
    - To override, create a `.env` file:
      ```
      REACT_APP_API_URL=http://your-backend-host:8000
      ```
    - For WebSocket (optional, if implemented server-side):
      ```
      REACT_APP_WS_URL=ws://localhost:8000/ws/game/:gameId
      ```
    - Otherwise, the UI falls back to polling updates.

4. Start the dev server:
    ```bash
    npm start
    ```
    Open [http://localhost:3000](http://localhost:3000) to use the app.

---

## Usage

- **Sign up or log in** to begin (homepage).
- **Create a game** or **join** an existing one.
- **Play moves**: Click spaces to take your turn!
- **View the leaderboard** via the navigation sidebar.
- Login is required for all playing/leaderboard features (session cookie set automatically).

---

## Developer Notes

- UI built as modular React components. Customize them in `src/`.
- Styles/theme in `src/App.css`—supports primary/secondary/accent via CSS variables.
- Uses HTTP-only cookies for auth: ensure CORS backend config allows credentials.
- Main backend endpoints expected:
    - `POST /auth/signup` – Register
    - `POST /auth/login` – Login
    - `POST /games/create` – New game
    - `POST /games/join` – Join game
    - `POST /games/play` – Play a move
    - `GET /games/{game_id}` – Retrieve game
    - `GET /leaderboard/` – Top players

  Refer to backend API reference for schema details and real responses.

- All game logic and turn enforcement is handled by the backend.

### Running Tests

```bash
npm test
```

---

## Known Issues / Limitations

- Assumes backend runs locally on port 8000 by default (see `.env` for how to override).
- Full test suite only covers UI unit/component logic; backend must be separately running for full integration tests.
- If backend session or CORS is misconfigured, login/game features may fail.
- WebSocket is opt-in and falls back to polling if missing.
- Only two users per game supported.

---

## Styling and Customization

- Colors: Adjust in `src/App.css` – defaults:  
  - Primary: `#1976D2`  
  - Secondary: `#424242`  
  - Accent: `#FFEB3B`  

- Layout: Header, board area, sidebar for navigation/history.

---

## Contributing

Feedback, issues, and PRs welcome! See `src/` for core UI logic.

---
