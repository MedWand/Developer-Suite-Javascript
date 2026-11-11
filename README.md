# MedWand DECL JavaScript Sample

Browser sample for the MedWand Device Encapsulation and Communication Library
(DECL), demonstrating temperature, pulse oximetry, ECG, stethoscope, and camera
workflows. The sample installs the SDK from npm and bundles it into a browser
app served by ASP.NET Core (.NET 10).

## Requirements

- .NET 10 SDK and Node.js 22 with npm
- For Visual Studio, the **ASP.NET and web development** workload
- Google Chrome or Microsoft Edge with Web Serial support
- A MedWand device and supplied DECL license and public key
- Internet access for Bootstrap assets loaded from a CDN

## Setup and run

1. From the repository root, install the locked dependencies and build the browser bundle.

   ```sh
   npm ci
   npm run build
   ```
2. Copy `SampleApp/wwwroot/license.example.txt` to
   `SampleApp/wwwroot/license.local.txt` and fill in the JSON values:

   ```json
   {
     "license": "YOUR_LICENSE",
     "publicKey": "YOUR_PUBLIC_KEY"
   }
   ```

3. Run `dotnet run --project SampleApp --launch-profile https`. In Visual Studio,
   open `Developer-Suite-Javascript.slnx`, set `SampleApp` as the startup project,
   select the **https** profile, and press **F5**.
4. Open [https://localhost:7242](https://localhost:7242) in Chrome or Edge. Trust
   the development HTTPS certificate if prompted.
5. Select **Continue**, connect the MedWand, and select **Start**. Choose the
   MedWand serial device if prompted and allow camera or microphone access when needed.

When the connected MedWand requires newer firmware, the sample releases the
normal controller and displays **Update Firmware**. Select it and choose the
MedWand again to run the production firmware download, programming, verification,
commit, and restart workflow. Keep the device connected and the computer awake
until the sample reconnects and finishes initialization.

The browser downloads `license.local.txt` when the page loads. Git and .NET
publish exclude this file. Reload the page after changing it. Launch addresses are configured in
`SampleApp/Properties/launchSettings.json`.

## Camera

Select **Dermatoscope** or **Otoscope** to start preview, then **Capture** to save
an image in the sample. Captures also appear in **Summary**. Select **Off** to
stop preview.

Camera controls are **LED Intensity**, **Focus**, **Move**, **Zoom**, **Radius**,
and **Reset**. Availability depends on the camera capabilities and selected mode;
Move, Zoom, Radius, and Reset apply to the otoscope mask.

During otoscope preview, use arrow keys to move, **+ / -** to zoom,
**Page Up / Page Down** to adjust radius, and **Delete** to reset. Shortcuts are
inactive while a button or input has keyboard focus.

## Source and SDK

- `SampleApp/wwwroot/src/`: application and sensor examples
- `@medwand/mwsdk-javascript`: device SDK installed from npm
- `SampleApp/wwwroot/assets/js/sample-app.js`: generated browser bundle

Run `npm run build` after editing the JavaScript or changing the SDK dependency.
Run it before `dotnet publish SampleApp -c Release` to include the browser bundle in the publish output.

## Troubleshooting

- If the license does not load, check `license.local.txt` for valid JSON and
  nonempty `license` and `publicKey` values, then reload.
- If the device cannot connect, check its USB connection and close other tabs or
  applications using it.
- If camera or microphone access fails, check browser permissions for the sample.
- For development HTTPS certificate errors, run `dotnet dev-certs https --trust`.
