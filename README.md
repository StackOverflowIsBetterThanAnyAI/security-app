# Security App

## Usage Guide

1. Install eas-cli: `npm install -g eas-cli`

2. APK File: Create an APK file by building the application with `npx eas build --platform android`.

3. APK File: Or download the archive from the [latest release](https://github.com/StackOverflowIsBetterThanAnyAI/security-app/releases)

4. Installation: Install the Android app using this APK file.

5. Account Creation: Register a new account. You will automatically be assigned the User role.

6. Gain Access: An Admin must manually change your role to Member.

7. View Images: Once upgraded, you can navigate to the Gallery tab to see the images, which are recorded on a Raspberry Pi Zero W and updated every 5 minutes, or checkout the Live section to view the current camera screen.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 24 (same version as the CI workflow) and npm
- An Android smartphone with [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent) installed. The project uses **Expo SDK 58**, which requires the current Expo Go version from the Play Store.
- The [backend](https://github.com/StackOverflowIsBetterThanAnyAI/security-backend) running on the Raspberry Pi
- Smartphone, development machine and Raspberry Pi in the same network

### Installation

```sh
git clone https://github.com/StackOverflowIsBetterThanAnyAI/security-app.git
cd security-app
npm ci
```

### Backend Address

The app talks to the backend via plain HTTP. The address is configured in [`constants/api.ts`](constants/api.ts):

```ts
export const URL = 'http://192.168.178.87:5000'
```

Change it to the IP address and port of your Raspberry Pi. Cleartext HTTP is explicitly allowed for Android builds via `usesCleartextTraffic` in [`app.json`](app.json).

### Start the App

**Option A: Expo Go** (quickest, no build required)

```sh
npm start
```

Scan the QR code shown in the terminal with the Expo Go app. If the phone cannot reach your machine (e.g. because of a firewall or a guest network), use `npx expo start --go --tunnel`.

**Option B: Development Build** (own app with `expo-dev-client`)

```sh
npx eas build --profile development --platform android
```

Install the resulting APK on the phone, then run `npx expo start --dev-client` and open the project from the installed development app.

### Checks

```sh
npm run lint                 # ESLint (incl. React Compiler rules)
npx tsc --noEmit             # TypeScript
npx expo-doctor              # Expo project health check
npx expo install --check     # dependency versions match the Expo SDK
```

## Backend Repository

[Backend Repository](https://github.com/StackOverflowIsBetterThanAnyAI/security-backend)
