# Mobile dev — Windows setup

Environment provisioned on 2026-04-22. All checks green (`expo-doctor` 18/18).

## What's installed

| Tool                | Version                                                                       | Location                                           |
| ------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Node                | 24.14                                                                         | system                                             |
| pnpm                | 10.11                                                                         | system                                             |
| OpenJDK (Microsoft) | 17.0.18                                                                       | `C:\Program Files\Microsoft\jdk-17.0.18.8-hotspot` |
| Android Studio      | 2025.3.3.7                                                                    | `C:\Program Files\Android\Android Studio`          |
| Android SDK         | cmdline-tools, platform-tools (adb), platforms;android-34, build-tools;34.0.0 | `C:\Users\77147\AppData\Local\Android\Sdk`         |

User-scope env vars (open a NEW terminal for them to take effect):

- `JAVA_HOME` = OpenJDK path
- `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`
- `ANDROID_SDK_ROOT` = same as above
- `PATH` += `%JAVA_HOME%\bin`, `%ANDROID_HOME%\platform-tools`, `%ANDROID_HOME%\emulator`

## Run the app

### Path 1 — Expo Go on a physical phone (fastest, no emulator needed)

```sh
pnpm --filter @domera/mobile dev
```

Scan the QR code with the Expo Go app (iOS App Store / Google Play). Phone and PC must be on the same Wi-Fi. Hot reload works over LAN.

### Path 2 — Web preview in browser (quick smoke, no camera/QR)

```sh
pnpm --filter @domera/mobile web
```

Open `http://localhost:19100`. Camera + secure-store won't work — use for UI smoke only.

### Path 3 — Android emulator (full native)

One-time AVD creation (needs a system image; not pre-installed to save ~1.5 GB):

```sh
# Install a system image + create AVD — run from any shell after opening a new terminal
sdkmanager "system-images;android-34;google_apis_playstore;x86_64"
avdmanager create avd -n Pixel7 -k "system-images;android-34;google_apis_playstore;x86_64" -d pixel_7
```

Then:

```sh
emulator -avd Pixel7 &
pnpm --filter @domera/mobile android
```

Or simpler: open Android Studio once → Device Manager → create AVD with the GUI wizard → relaunch `pnpm … android`.

### Path 4 — Physical Android device over USB

1. Enable Developer options → USB debugging on the phone
2. Plug in USB, confirm the fingerprint prompt
3. `adb devices` should list the device
4. `pnpm --filter @domera/mobile android`

## Point the app at the backend

`apps/mobile/app.json` → `expo.extra.apiBase` controls the API base URL. Dev default: `http://localhost:4000`.

For Expo Go on a phone the phone can't reach `localhost` of your PC — use your PC's LAN IP (e.g. `http://192.168.1.23:4000`) or an ngrok tunnel.

For production the value comes from an EAS build profile pointing at `https://api.domerahub.com`.

## Troubleshooting

- **`JAVA_HOME not set`** — close the shell and open a new one. The env vars were written to User scope by `setx`-equivalent; existing shells won't see them.
- **`adb: no devices/emulators found`** — start the emulator first, or plug in USB and authorise the RSA key on the device.
- **Metro bundler can't serve to phone** — PC firewall is blocking port 19100. Either allow Node/pnpm in Windows Defender Firewall, or run `pnpm --filter @domera/mobile dev -- --tunnel` to route via Expo tunnel (slower but no firewall issues).
