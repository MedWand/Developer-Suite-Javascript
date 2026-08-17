# MedWand DECL JavaScript Sample

This repository contains a Visual Studio web application demonstrating how to
use the MedWand Device Encapsulation and Communication Library (DECL) from
browser JavaScript.

The ASP.NET Core project serves the browser application as static content. The
sample does not require an npm install or JavaScript build step.

## Prerequisites

- Visual Studio with the **ASP.NET and web development** workload
- The .NET 10 SDK
- Google Chrome or Microsoft Edge with Web Serial support
- Internet access to load Bootstrap from its CDN
- A MedWand device
- A valid DECL license and public key

## Open the Solution

Open `Developer-Suite-Javascript.slnx` in Visual Studio. The solution contains
the `SampleApp` ASP.NET Core project.

The browser application is located under `SampleApp/wwwroot`:

```text
SampleApp/
  Program.cs
  SampleApp.csproj
  wwwroot/
    index.html
    assets/
    src/
```

## Configure the DECL License

Open `SampleApp/wwwroot/src/app.js` and set these constants to the values
supplied for your integration:

```js
const MW_DECL_LICENSE = "YOUR_LICENSE";
const MW_DECL_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
```

Do not commit development or production license values to a public repository.

## Run in Visual Studio

1. Select `SampleApp` as the startup project.
2. Select the **https** launch profile.
3. Select Google Chrome or Microsoft Edge as the browser.
4. Press **F5** to debug or **Ctrl+F5** to run without debugging.
5. If prompted, trust the ASP.NET Core development HTTPS certificate.

The default HTTPS address is:

```text
https://localhost:7242
```

The port can be changed in
`SampleApp/Properties/launchSettings.json`. Using the HTTPS profile is
recommended because the DECL communicates with the device through Web Serial.

## Connect a MedWand

After the application opens:

1. Select **Continue** on the beta notice.
2. Plug in the MedWand device.
3. Select **Start** in the connection dialog.
4. Choose the MedWand serial device when the browser prompts.

Web Serial requires device selection to be initiated by a user action. Browser
permissions are associated with the application's origin, so continue using the
same HTTPS host and port after granting access.

## Troubleshooting

- Use a current version of Chrome or Edge; other browsers may not support Web
  Serial.
- If the browser cannot find the device, verify that it is connected and that
  another browser tab or desktop application is not already using its serial
  port.
- If HTTPS produces a certificate warning, use Visual Studio's certificate
  prompt or run `dotnet dev-certs https --trust` from a developer terminal.
