# MedWand DECL JavaScript Sample

Browser sample for the MedWand Device Encapsulation and Communication Library
(DECL), demonstrating temperature, pulse oximetry, ECG, stethoscope, and camera
workflows. An ASP.NET Core (.NET 10) application serves the sample and bundled
SDK; no npm install or JavaScript build step is required.

## Requirements

- Visual Studio with the **ASP.NET and web development** workload and .NET 10 SDK
- Google Chrome or Microsoft Edge with Web Serial support
- A MedWand device and supplied DECL license and public key
- Internet access for Bootstrap assets loaded from a CDN

## Setup and run

1. Open `Developer-Suite-Javascript.slnx` in Visual Studio.
2. Copy `SampleApp/wwwroot/license.example.txt` to
   `SampleApp/wwwroot/license.local.txt` and fill in the JSON values:

   ```json
   {
     "license": "YOUR_LICENSE",
     "publicKey": "YOUR_PUBLIC_KEY"
   }
   ```

3. Set `SampleApp` as the startup project and select the **https** launch profile.
4. Run with **F5** or **Ctrl+F5**, then open [https://localhost:7242](https://localhost:7242)
   in Chrome or Edge. Trust the development HTTPS certificate if prompted.
5. Select **Continue**, connect the MedWand, and select **Start**. Choose the
   MedWand serial device if prompted and allow camera or microphone access when needed.

The license file is ignored by Git but is downloaded by the browser. Reload the
page after changing it. Launch addresses are configured in
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
- `SampleApp/wwwroot/assets/js/MWSDK.Javascript.js`: bundled SDK (`MedWandSdk` global)

## Troubleshooting

- If the license does not load, check `license.local.txt` for valid JSON and
  nonempty `license` and `publicKey` values, then reload.
- If the device cannot connect, check its USB connection and close other tabs or
  applications using it.
- If camera or microphone access fails, check browser permissions for the sample.
- For development HTTPS certificate errors, run `dotnet dev-certs https --trust`.
