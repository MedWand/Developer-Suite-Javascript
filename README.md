# MedWand DECL JavaScript Sample

This repository contains a browser sample application demonstrating how to use
the MedWand Device Encapsulation and Communication Library (DECL).

## Prerequisites

- Node.js 20.11 or newer
- Google Chrome or Microsoft Edge with Web Serial support
- Internet access to load Bootstrap from its official CDN
- A MedWand device
- A valid DECL license and public key

## Configure the DECL License

Open `SampleWebApp/src/app.js` and set these constants to the values supplied
for your integration:

```js
const MW_DECL_LICENSE = "YOUR_LICENSE";
const MW_DECL_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
```

Do not commit development or production license values to a public repository.

## Run the Sample App

The sample uses browser-ready JavaScript files and does not require an npm
install or build step. From the repository root, run:

```powershell
node .\SampleWebApp\server.mjs
```

The server prints the application URL:

```text
MedWand sample: http://127.0.0.1:8080
```

Open that exact URL in Chrome or Edge:

1. Select **Continue** on the initial notice.
2. Plug in the MedWand device.
3. Select **Start** in the connection modal.
4. Choose the MedWand serial device when the browser prompts.

Web Serial requires device selection to be triggered by a user action.

## Use a Different Port

In PowerShell:

```powershell
$env:PORT=8081
node .\SampleWebApp\server.mjs
```

## Browser Permissions and Troubleshooting

Browser permissions are specific to the application origin. Continue using the
same host and port after granting serial, camera, or microphone permission.

Camera and stethoscope features require separate browser permissions. If a
camera or microphone reports that it cannot be opened, close other browser
tabs and desktop applications using that device before trying again.
