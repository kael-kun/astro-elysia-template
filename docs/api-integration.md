## Login

### Endpoint: POST /auth/login

#### Request Body
```json
{
  "email": "user@example.com",
  "password": "mypassword"
}
```

#### Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

The login endpoint will also set a refreshToken httpOnly cookie which will be used to obtain new access tokens.

## Refresh Token

### Endpoint: POST /auth/refresh

#### Response
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

This endpoint generates a new access token using the refreshToken cookie.

## Logout

### Endpoint: POST /auth/logout

#### Response
```json
{
  "success": true
}
```

This endpoint revokes the user's session and clears the refreshToken cookie.

## Integrating Authentication

To integrate authentication in the frontend, follow these steps.

### 1. Global Access Token Store

The access token should be stored in a global in-memory state, not in localStorage or sessionStorage, for better security.

Create a simple global store.

Example:

```javascript
// src/lib/authStore.js
let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}
```

This allows any page or component to access the token.

### 2. Login Flow

When the user logs in:

1. Send request to /auth/login
2. Store the returned accessToken in the global state

Example:

```javascript
import { setAccessToken } from "../lib/authStore";

async function login(email, password) {
  const res = await fetch("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();
  setAccessToken(data.accessToken);
}
```

The refreshToken cookie is automatically stored by the browser.

### 3. Initialize Authentication on Page Load

Because the accessToken is stored only in memory, it will be lost when the page refreshes.

To restore the session, the frontend should call /auth/refresh when the application loads.

Example initialization:

```javascript
// src/lib/initAuth.js
import { setAccessToken } from "./authStore";

export async function initAuth() {
  try {
    const res = await fetch("/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();
    setAccessToken(data.accessToken);
  } catch (err) {
    console.log("User not authenticated");
  }
}
```

### 4. Run Initialization on App Start

When the page loads, run the initialization function.

Example:

```javascript
import { initAuth } from "../lib/initAuth";

await initAuth();
```

This will:

- Check if the refreshToken cookie exists
- Request a new access token
- Store it in the global state

### 5. Authenticated API Requests

When calling protected endpoints, include the access token in the Authorization header.

Example:

```javascript
import { getAccessToken } from "../lib/authStore";

async function getProfile() {
  const token = getAccessToken();

  const res = await fetch("/auth/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  return res.json();
}
```

### 6. Automatic Token Refresh Strategy

If a request returns 401 Unauthorized, the frontend should:

1. Call /auth/refresh
2. Store the new accessToken
3. Retry the original request

### 7. Logout Flow

When the user logs out:

1. Call /auth/logout
2. Clear the stored access token

Example:

```javascript
import { clearAccessToken } from "../lib/authStore";

async function logout() {
  await fetch("/auth/logout", {
    method: "POST",
    credentials: "include",
  });

  clearAccessToken();
}
```

## Final Authentication Architecture

```
Frontend
│
├── accessToken (global memory state)
└── refreshToken (httpOnly cookie)

Backend
│
├── verify JWT
└── validate session in database

Database
│
├── users
└── sessions
```

✅ With this approach:

- Access tokens remain secure in memory
- Sessions persist via refresh token cookies
- Users stay logged in even after page refresh.