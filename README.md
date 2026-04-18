# Domera Mobile

Expo / React Native 0.79 mobile client for the Domera building OS.

## Stack

- **Expo** with **Expo Router** (file-based navigation)
- **React Native 0.79**, React 19
- TypeScript

## Getting started

```bash
cp .env.example .env          # set EXPO_PUBLIC_API_URL
npm install
npx expo start                # scan QR with Expo Go, or run `npx expo run:ios`
```

The mobile client authenticates against the same [Domera backend](https://github.com/<owner>/domera-backend)
and scopes all requests to the user's active workspace + building.

## License

Proprietary — all rights reserved.
