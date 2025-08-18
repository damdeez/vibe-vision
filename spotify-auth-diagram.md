# SpotifyService and NextJS Auth Integration Diagram

```mermaid
graph TB
    A[User] --> B[SpotifyIntegration Component]
    B --> C{Session Status}
    
    C -->|No Session| D[Show Connect Button]
    C -->|Loading| E[Show Loading State]
    C -->|Has Session| F[Check Access Token]
    
    D --> G[Spotify Sign In]
    G --> H[NextAuth Route Handler]
    H --> I[Spotify OAuth Provider]
    I --> J[Spotify Authorization Server]
    J --> K[User Authorizes App]
    K --> L[Authorization Code]
    L --> H
    
    H --> M[JWT Callback]
    M --> N[Store Tokens in JWT]
    N --> O[Session Callback]
    O --> P[Attach accessToken to Session]
    
    F -->|Valid Token| Q[Create SpotifyService Instance]
    F -->|Expired Token| R[Refresh Token Process]
    F -->|Refresh Error| S[Show Reconnect Message]
    
    R --> T[refreshAccessToken Function]
    T --> U[Spotify Token Endpoint]
    U --> V[New Access Token]
    V --> Q
    
    Q --> W[SpotifyService Methods]
    W --> X[getCurrentlyPlaying API Call]
    W --> Y[getAudioFeatures API Call] 
    W --> Z[getUserPlaylists API Call]
    
    X --> AA[Update Current Track State]
    AA --> BB[Display Track Info in UI]
    
    style H fill:#f9f,stroke:#333,stroke-width:2px
    style Q fill:#9f9,stroke:#333,stroke-width:2px
    style W fill:#99f,stroke:#333,stroke-width:2px
```

## Key Components

1. **NextAuth Route Handler** (`/api/auth/[...nextauth]/route.ts`): Manages OAuth flow with Spotify
2. **SpotifyService Class** (`/services/spotify.ts`): Handles Spotify API calls with access token
3. **SpotifyIntegration Component** (`/components/SpotifyIntegration.tsx`): UI component managing auth state and displaying track info
4. **Type Extensions** (`/types/next-auth.d.ts`): Extends NextAuth types to include Spotify tokens

## Flow

- User clicks "Connect Spotify" → NextAuth handles OAuth → Tokens stored in JWT → Session provides access token → SpotifyService makes API calls → Track data displayed in UI
- Token refresh happens automatically when expired via `refreshAccessToken` function

## File Structure

```
src/
├── app/
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts          # NextAuth configuration and handlers
├── components/
│   └── SpotifyIntegration.tsx        # UI component for Spotify integration
├── services/
│   └── spotify.ts                    # SpotifyService class for API calls
└── types/
    └── next-auth.d.ts               # Type extensions for NextAuth
```