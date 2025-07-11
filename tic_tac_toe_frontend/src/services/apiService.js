/**
 * PUBLIC_INTERFACE
 * API service for communicating with backend endpoints (login, signup, game, leaderboard).
 * Handles token authentication, error management, and simplifies route calls.
 */
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000"; // Adjust as necessary

let authToken = null;

// PUBLIC_INTERFACE
function setAuthToken(token) {
  authToken = token;
}

// PUBLIC_INTERFACE
function clearAuthToken() {
  authToken = null;
}

// Wrapper fetch utility with error/token logic
async function apiFetch(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
    ...options.headers
  };

  try {
    const response = await fetch(`${BACKEND_BASE_URL}${path}`, {
      ...options,
      headers
    });

    let result;
    const isJson = response.headers.get("content-type")?.includes("application/json");
    if (isJson) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (!response.ok) {
      throw new Error(result?.detail || result?.error || response.statusText);
    }

    return result;
  } catch (err) {
    throw err;
  }
}

// PUBLIC_INTERFACE
const api = {
  setAuthToken,
  clearAuthToken,

  // PUBLIC_INTERFACE
  async login({ username, password }) {
    // Assumes backend exposes /auth/login (POST)
    const result = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    return { user: result.user, token: result.token };
  },

  // PUBLIC_INTERFACE
  async signup({ username, password }) {
    // Assumes backend exposes /auth/signup (POST)
    const result = await apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    return { user: result.user, token: result.token };
  },

  // PUBLIC_INTERFACE
  async fetchLobby() {
    return apiFetch("/lobby");
  },

  // PUBLIC_INTERFACE
  async fetchGame(gameId) {
    return apiFetch(`/game/${gameId}`);
  },

  // PUBLIC_INTERFACE
  async makeMove(gameId, moveData) {
    return apiFetch(`/game/${gameId}/move`, {
      method: "POST",
      body: JSON.stringify(moveData)
    });
  },

  // PUBLIC_INTERFACE
  async fetchLeaderboard() {
    return apiFetch("/leaderboard");
  }
};

export default api;
