import type { BrowserSerialPort, SerialPortRequestOptions } from "./browserTypes.js";
import { TypedEventTarget } from "./events.js";
import { CameraModule } from "./modules/camera.js";
import { EcgModule } from "./modules/ecg.js";
import { StethoscopeModule } from "./modules/stethoscope.js";
import { LicenseState } from "./core/enumLicense.js";
import { DeviceState } from "./core/enumDeviceState.js";
import { MedWandDeviceError } from "./core/medWandDeviceError.js";
import { ReadingState } from "./core/enumReadingState.js";
import { MedWandReading } from "./core/medWandReading.js";
import { MedWandGeneration } from "./core/enumGeneration.js";
import { MedWandSensor } from "./core/enumSensor.js";
import { MicrophoneModes } from "./core/enumMicrophoneMode.js";
import { CameraModes } from "./core/enumCameraMode.js";
type MedWandControllerEvents = {
    licenseError: LicenseState;
    deviceStateChanged: DeviceState;
    deviceError: MedWandDeviceError;
    readingStateChanged: ReadingState;
    readingReceived: MedWandReading;
    ledIntensityChanged: number;
    serialData: {
        direction: "tx" | "rx";
        text: string;
        hex: string;
    };
};
export type MedWandControllerOptions = {
    serialRequestOptions?: SerialPortRequestOptions;
    autoRequestPort?: boolean;
    port?: BrowserSerialPort;
};
/**
 * Represents a controller for managing and interacting with various MedWand devices in a browser application.
 *
 * @remarks
 * This class provides functionality to configure and control devices such as stethoscopes, cameras, and ECG modules.
 * It combines the Windows SDK's base controller and platform-specific implementation into one browser-oriented class.
 */
export declare class MedWandController extends TypedEventTarget<MedWandControllerEvents> {
    private readonly licenseController;
    private readonly deviceStateMachine;
    private readonly readingStateMachine;
    private readonly serialRequestOptions;
    private readonly autoRequestPort;
    private serialPort;
    private serialReader;
    private serialWriter;
    private receiveTask;
    private abortController;
    private responseBuffer;
    private pendingResponses;
    private firmwareVersionText;
    private bootloaderResponse;
    private deviceIdText;
    private udiText;
    private generationNumber;
    private lastBootloaderCheck;
    private isBootloaderModeValue;
    private packer;
    private ledIntensityValue;
    private stethoscopeFilterValue;
    private stethoscopeModule;
    private cameraModule;
    private ecgModule;
    /**
     * Represents the name of the MedWand device.
     *
     * @remarks
     * This field is initialized with the default value "MedWand".
     */
    DeviceName: string;
    /**
     * Creates a browser MedWand controller.
     *
     * @param options - Browser serial configuration and optional preselected serial port.
     */
    constructor(options?: MedWandControllerOptions);
    /**
     * Initializes the MedWand controller with the provided license information and public key.
     *
     * @param licenseString - The license string required to initialize the MedWand controller. This value must not be null or empty.
     * @param publicKey - The public key associated with the license string. This value must not be null or empty.
     *
     * @remarks
     * If the license is invalid, expired, or nearing expiration, the `licenseError` event will be triggered.
     *
     * @throws Error when `licenseString` or `publicKey` is null or empty.
     */
    private construct;
    /**
     * Initializes the MedWand controller with the provided license information and public key.
     *
     * @param licenseString - The license string required to initialize the MedWand controller. This value must not be null or empty.
     * @param publicKey - The public key associated with the license string. This value must not be null or empty.
     *
     * @remarks
     * If the license is invalid, expired, or nearing expiration, the `licenseError` event will be triggered.
     */
    Construct(licenseString: string, publicKey: string): void;
    /**
     * Configures the `MedWandController` by initializing its modules based on available features
     * and optionally setting up the ECG module with the provided canvas.
     *
     * @param ecgCanvas - An `HTMLCanvasElement` used to initialize the ECG module if the ECG feature is available.
     * Pass `null` if the ECG module should not be initialized with a canvas.
     *
     * @remarks
     * This method initializes the stethoscope, camera, and ECG modules if their respective features are enabled.
     */
    private configure;
    /**
     * Configures the `MedWandController` by initializing its modules based on available features
     * and optionally setting up the ECG module with the provided canvas.
     *
     * @param ecgCanvas - An `HTMLCanvasElement` used to initialize the ECG module if the ECG feature is available.
     * Pass `null` if the ECG module should not be initialized with a canvas.
     */
    Configure(ecgCanvas?: HTMLCanvasElement | null): void;
    /**
     * Gets a value indicating whether the license associated with the MedWand device is valid.
     *
     * @remarks
     * This property is determined by the internal license controller and reflects the current state of the license.
     */
    private get isLicenseValid();
    /**
     * Gets a value indicating whether the license associated with the MedWand device is valid.
     */
    get IsLicenseValid(): boolean;
    /**
     * Gets the current state of the MedWand device.
     *
     * @remarks
     * The `deviceState` property reflects the current operational state of the device, such as whether it is connected,
     * disconnected, initializing, or in an error state. Changes to this property trigger the `deviceStateChanged` event.
     */
    private get deviceState();
    /**
     * Gets the current state of the MedWand device.
     */
    get DeviceState(): DeviceState;
    /**
     * Gets the current state of the reading process for the MedWand device.
     *
     * @remarks
     * The `readingState` property reflects the operational state of the device's reading mechanism.
     * Possible states include `Stopped`, `Starting`, `Started`, `Reading`, `Recording`, `Stopping`, and `Error`.
     */
    private get readingState();
    /**
     * Gets the current state of the reading process for the MedWand device.
     */
    get ReadingState(): ReadingState;
    /**
     * Gets a value indicating whether the MedWand device is currently connected.
     *
     * @remarks
     * A device is considered connected if its state is `Connected`, `Initializing`, or `Initialized`.
     */
    private get isConnected();
    /**
     * Gets a value indicating whether the MedWand device is currently connected.
     */
    get IsConnected(): boolean;
    /**
     * Gets a value indicating whether the MedWand device has been successfully initialized.
     *
     * @remarks
     * The `isInitialized` property reflects the initialization state of the MedWand device. It becomes `true` after
     * the device has completed the initialization process successfully.
     */
    private get isInitialized();
    /**
     * Gets a value indicating whether the MedWand device has been successfully initialized.
     */
    get IsInitialized(): boolean;
    /**
     * Gets the license information associated with the current instance of the MedWand controller.
     *
     * @remarks
     * This property retrieves a string representation of the license details managed by the underlying license controller.
     */
    private get licenseInfo();
    /**
     * Gets the license information associated with the current instance of the MedWand controller.
     */
    get LicenseInfo(): string;
    /**
     * Gets a value indicating whether the stethoscope feature can be used with the current license.
     *
     * @remarks
     * This property checks the license to determine if the "Stethoscope" feature is enabled.
     */
    private get canUseStethoscope();
    /**
     * Gets a value indicating whether the stethoscope feature can be used with the current license.
     */
    get CanUseStethoscope(): boolean;
    /**
     * Gets a value indicating whether the camera feature can be used based on the current license.
     *
     * @remarks
     * This property checks the license to determine if the "Camera" feature is enabled.
     */
    private get canUseCamera();
    /**
     * Gets a value indicating whether the camera feature can be used based on the current license.
     */
    get CanUseCamera(): boolean;
    /**
     * Gets a value indicating whether the ECG (Electrocardiogram) feature can be used.
     *
     * @remarks
     * This property checks the license to determine if the ECG feature is enabled.
     */
    private get canUseEcg();
    /**
     * Gets a value indicating whether the ECG (Electrocardiogram) feature can be used.
     */
    get CanUseEcg(): boolean;
    /**
     * Gets the Vendor ID of the connected MedWand device.
     *
     * @remarks
     * The Vendor ID is a unique identifier assigned to the manufacturer of the device.
     */
    private get vendorId();
    /**
     * Gets the Vendor ID of the connected MedWand device.
     */
    get VendorId(): string | null;
    /**
     * Gets the product identifier of the connected MedWand device.
     *
     * @remarks
     * The product identifier is typically used to uniquely identify the connected device model.
     */
    private get productId();
    /**
     * Gets the product identifier of the connected MedWand device.
     */
    get ProductId(): string | null;
    /**
     * Gets the name of the port associated with the MedWand device.
     *
     * @remarks
     * In the browser SDK this value is `WebSerial` when a serial port is assigned, or `null` when no port is assigned.
     */
    private get comPort();
    /**
     * Gets the name of the port associated with the MedWand device.
     */
    get ComPort(): string | null;
    /**
     * Establishes a connection to the MedWand device.
     *
     * @remarks
     * This method attempts to locate and connect to the MedWand device via Web Serial. It validates the license,
     * configures the serial port, and initializes browser receive processing.
     *
     * @throws Error if the license is invalid, the device cannot be found, the serial port fails to connect,
     * or any other unexpected error occurs during the connection process.
     */
    private connect;
    /**
     * Establishes a connection to the MedWand device.
     */
    Connect(): Promise<void>;
    /**
     * Initializes the MedWand device, setting it to the `Initialized` state if successful.
     *
     * @remarks
     * This method ensures that the MedWand device is properly initialized and ready for use. It transitions the device
     * state to `Initializing` during the process and to `Initialized` upon successful completion. If an error occurs,
     * the device state is set to `Error`.
     *
     * @throws Error when the license is invalid, the device is not connected, the initialization command cannot be sent,
     * the device does not respond, or the initialization result is unsuccessful.
     */
    private initialize;
    /**
     * Initializes the MedWand device, setting it to the `Initialized` state if successful.
     */
    Initialize(): Promise<void>;
    /**
     * Gets the firmware version of the connected MedWand device.
     *
     * @remarks
     * The firmware version is retrieved from the device during the connection process. If the firmware version cannot
     * be determined, an empty string is returned until a successful response is received.
     */
    private getFirmwareVersion;
    /**
     * Gets the cached firmware version of the connected MedWand device.
     */
    private get firmwareVersion();
    /**
     * Gets the cached firmware version of the connected MedWand device.
     */
    get FirmwareVersion(): string;
    /**
     * Determines whether the device is currently in bootloader mode.
     *
     * @param forceCheck - If set to `true`, forces a fresh check of the device's bootloader mode status,
     * bypassing any cached results. Defaults to `false`.
     * @returns `true` if the device is in bootloader mode; otherwise, `false`.
     *
     * @remarks
     * This method communicates with the device to verify its bootloader mode status. If `forceCheck` is `false`,
     * the method may return a cached result if the last check occurred within the past 10 minutes.
     */
    private isBootloaderMode;
    /**
     * Determines whether the device is currently in bootloader mode.
     */
    IsBootloaderMode(forceCheck?: boolean): Promise<boolean>;
    /**
     * Gets the unique identifier of the connected MedWand device.
     *
     * @remarks
     * If the identifier is not already cached, this method attempts to fetch it by transmitting the appropriate command
     * to the device and waiting for a response.
     */
    private getDeviceId;
    /**
     * Gets the cached unique identifier of the connected MedWand device.
     *
     * @remarks
     * Returns an empty string if the identifier has not been retrieved.
     */
    private get deviceId();
    /**
     * Gets the cached unique identifier of the connected MedWand device.
     */
    get DeviceId(): string;
    /**
     * Gets the generation of the MedWand device.
     *
     * @remarks
     * The generation is determined based on the device's unique identifier or by querying the device.
     * Possible values include `Generation1`, `Generation2`, `Generation25`, `Unknown`, and `NotReady`.
     */
    private getGeneration;
    /**
     * Gets the cached generation of the MedWand device.
     */
    private get generation();
    /**
     * Gets the cached generation of the MedWand device.
     */
    get Generation(): MedWandGeneration;
    /**
     * Gets the UDI value of the connected MedWand device.
     *
     * @remarks
     * If the UDI is not already cached, this method attempts to fetch it by transmitting the appropriate command
     * to the device and waiting for a response.
     */
    private getUdi;
    /**
     * Gets the cached UDI value of the connected MedWand device.
     */
    private get udi();
    /**
     * Gets the cached UDI value of the connected MedWand device.
     */
    get Udi(): string;
    /**
     * Gets the most recent reading received from the MedWand device.
     */
    private get lastReading();
    /**
     * Gets the most recent reading received from the MedWand device.
     */
    get LastReading(): MedWandReading;
    /**
     * Gets the currently active sensor.
     */
    private get activeSensor();
    /**
     * Gets the currently active sensor.
     */
    get ActiveSensor(): MedWandSensor;
    /**
     * Gets the current LED intensity value.
     */
    private get ledIntensity();
    /**
     * Gets the current LED intensity value.
     */
    get LedIntensity(): number;
    /**
     * Gets a value indicating whether a valid stethoscope module is available.
     */
    get HasValidStethoscope(): boolean;
    /**
     * Gets a value indicating whether the stethoscope is currently monitoring.
     */
    get StethoscopeIsMonitoring(): boolean;
    /**
     * Gets the stethoscope module associated with the controller.
     *
     * @remarks
     * The `stethoscope` property provides access to stethoscope-related functionality, such as monitoring and recording.
     */
    get Stethoscope(): StethoscopeModule | null;
    /**
     * Gets the model name of the connected stethoscope.
     */
    get StethoscopeModel(): string;
    /**
     * Gets the current microphone mode of the stethoscope.
     */
    get StethoscopeMode(): MicrophoneModes;
    /**
     * Converts the provided stethoscope capture data into a WAV audio file format.
     *
     * @param bytes - The byte array representing the stethoscope capture data.
     * @returns A Base64-encoded string representing the WAV audio file, or `null` if the conversion fails
     * or the stethoscope module is not valid.
     *
     * @remarks
     * This method utilizes the stethoscope module to process the raw capture data and generate a WAV audio file.
     * Ensure that the stethoscope module is properly initialized before calling this method.
     */
    StethoscopeWavFromCapture(bytes: Uint8Array): string | null;
    /**
     * Gets a value indicating whether a valid otoscope is available.
     */
    get HasValidOtoscope(): boolean;
    /**
     * Gets the camera module associated with the `MedWandController`.
     *
     * @remarks
     * The camera module provides functionality for managing camera operations, such as monitoring, zooming,
     * and adjusting LED intensity.
     */
    get Camera(): CameraModule | null;
    /**
     * Gets a value indicating whether the camera is currently monitoring.
     */
    get CameraIsMonitoring(): boolean;
    /**
     * Gets the model name of the connected camera.
     */
    get CameraModel(): string;
    /**
     * Gets the current camera mode of the connected camera module.
     */
    get CameraMode(): CameraModes;
    /**
     * Converts a captured byte array from the camera into a Base64-encoded bitmap string.
     *
     * @param bytes - The byte array representing the captured camera frame.
     * @param width - Optional frame width. If omitted, the selected camera resolution is used.
     * @param height - Optional frame height. If omitted, the selected camera resolution is used.
     * @returns A Base64-encoded bitmap string, or `null` if the camera module is not available.
     *
     * @remarks
     * This method utilizes the camera module to process the provided byte array and generate a Base64-encoded bitmap string.
     * Ensure that the camera module is valid before invoking this method.
     */
    CameraBmpFromCapture(bytes: Uint8Array | Uint8ClampedArray, width?: number, height?: number): string | null;
    /**
     * Gets a value indicating whether the camera associated with the controller has an "On Timer" feature.
     *
     * @remarks
     * This property checks if the camera's model supports the "On Timer" functionality.
     */
    get CameraHasOnTimer(): boolean;
    /**
     * Gets the maximum duration, in seconds, that the camera can remain active before requiring a cooldown period.
     */
    get CameraOnTimeMax(): number;
    /**
     * Gets the minimum cooldown time, in seconds, required for the camera to be operational again after it has been turned off.
     */
    get CameraCoolTimeMin(): number;
    /**
     * Moves the camera by the specified increments in the horizontal and vertical directions.
     *
     * @param incrementLeft - The amount to move the camera horizontally. A positive value moves the camera to the right,
     * a negative value moves it to the left, and `null` indicates no horizontal movement.
     * @param incrementTop - The amount to move the camera vertically. A positive value moves the camera downward,
     * a negative value moves it upward, and `null` indicates no vertical movement.
     */
    CameraMove(incrementLeft?: number | null, incrementTop?: number | null): void;
    /**
     * Adjusts the zoom level of the camera by the specified increment.
     *
     * @param increment - The amount by which to adjust the zoom level. Positive values zoom in, while negative values zoom out.
     *
     * @remarks
     * This method delegates the zoom functionality to the associated camera module. Ensure that a valid camera module is
     * available before invoking this method.
     */
    CameraZoom(increment: number): void;
    /**
     * Adjusts the otoscope mask opening radius by the specified increment.
     */
    private cameraResizeMask;
    /**
     * Gets the current otoscope mask geometry.
     */
    private get cameraOtoscopeMaskInfo();
    /**
     * Sets the camera LED intensity.
     */
    private setCameraLedIntensity;
    /**
     * Sets the camera LED intensity.
     */
    private SetCameraLedIntensity;
    /**
     * Sets the camera focus mode when the active browser camera supports it.
     */
    private setCameraFocusMode;
    /**
     * Sets the camera focus mode when the active browser camera supports it.
     */
    private SetCameraFocusMode;
    /**
     * Sets the manual focus distance when the active browser camera supports it.
     */
    private setCameraManualFocus;
    /**
     * Sets the manual focus distance when the active browser camera supports it.
     */
    private SetCameraManualFocus;
    /**
     * Resets the camera to its default state by invoking the reset functionality of the associated camera module.
     *
     * @remarks
     * This method resets the camera's zoom and position to their initial values. It has no effect if the camera module
     * is not valid or initialized.
     */
    CameraReset(): void;
    /**
     * Gets a value indicating whether the camera's LED intensity is adjustable.
     */
    get CameraLedIntensityAdjustable(): boolean;
    /**
     * Gets the maximum LED intensity value for the camera.
     */
    get CameraLedIntensityMax(): number;
    /**
     * Gets a value indicating whether a valid ECG (Electrocardiogram) module is available.
     */
    get HasValidEcg(): boolean;
    /**
     * Gets the ECG module associated with the MedWand device.
     *
     * @remarks
     * The ECG module provides functionality for monitoring, recording, and processing ECG data.
     */
    get Ecg(): EcgModule | null;
    /**
     * Gets the recorded ECG (Electrocardiogram) data as a list of numeric values.
     *
     * @remarks
     * This property retrieves the ECG data that was recorded during a session. The data is represented as a list of
     * numerical values, where each value corresponds to a specific point in the ECG signal. If no data is available,
     * the property returns `null`.
     */
    get EcgRecordedData(): number[] | null;
    /**
     * Converts a captured byte array from the ECG into a Base64-encoded bitmap string.
     *
     * @param bytes - The byte array representing the captured ECG data.
     * @returns A Base64-encoded bitmap string, or `null` if the ECG module is not available.
     *
     * @remarks
     * This method utilizes the ECG module to process the provided byte array and generate a Base64-encoded bitmap string.
     * Ensure that the ECG module is valid before invoking this method.
     */
    EcgBmpFromCapture(bytes: Uint8Array): string | null;
    /**
     * Starts the thermometer sensor for temperature measurement.
     *
     * @returns `true` if the thermometer starts successfully; otherwise, `false`.
     *
     * @remarks
     * Ensure that the necessary hardware and licenses are valid before calling this method.
     */
    private startThermometer;
    /**
     * Starts the thermometer sensor for temperature measurement.
     */
    StartThermometer(): Promise<boolean>;
    /**
     * Starts the pulse oximeter sensor.
     *
     * @returns `true` if the pulse oximeter sensor starts successfully; otherwise, `false`.
     */
    private startPulseOximeter;
    /**
     * Starts the pulse oximeter sensor.
     */
    StartPulseOximeter(): Promise<boolean>;
    /**
     * Starts the ECG (Electrocardiogram) monitoring process.
     *
     * @param canvas - Optional canvas used for ECG rendering.
     * @returns `true` if the ECG monitoring started successfully; otherwise, `false`.
     *
     * @throws Error when the ECG module is not initialized.
     */
    private startEcg;
    /**
     * Starts the ECG (Electrocardiogram) monitoring process.
     */
    StartEcg(canvas?: HTMLCanvasElement | null): Promise<boolean>;
    /**
     * Configures the stethoscope to operate in the specified microphone mode and optionally sets the speaker name.
     *
     * @param microphoneMode - The desired microphone mode for the stethoscope. Supported modes include Off, Heart,
     * Lungs, and Bowel.
     * @param speakerName - The name of the speaker to use for audio output. Can be `null` if no specific speaker is required.
     * @returns `true` if the stethoscope mode was successfully set; otherwise, `false`.
     *
     * @throws Error if the stethoscope module is not initialized or an unsupported microphone mode is provided.
     *
     * @remarks
     * This method stops any ongoing stethoscope preview or monitoring before applying the new mode.
     */
    private setStethoscopeMode;
    /**
     * Configures the stethoscope to operate in the specified microphone mode and optionally sets the speaker name.
     */
    SetStethoscopeMode(microphoneMode: MicrophoneModes, speakerName?: string | null): Promise<boolean>;
    /**
     * Configures the camera mode and optionally starts the camera preview.
     *
     * @param previewTarget - The `HTMLVideoElement` or `HTMLCanvasElement` where the camera preview will be displayed.
     * @param cameraMode - The desired camera mode.
     * @returns `true` if the camera mode was successfully set; otherwise, `false`.
     *
     * @throws Error if the camera module is not initialized or the specified camera mode is not valid.
     *
     * @remarks
     * This method stops any ongoing camera preview or operation before setting the new mode. Depending on the selected
     * mode, it may also adjust the LED intensity and start the camera.
     */
    private setCameraMode;
    /**
     * Configures the camera mode and optionally starts the camera preview.
     */
    SetCameraMode(previewTarget: HTMLVideoElement | HTMLCanvasElement | null, cameraMode: CameraModes): Promise<boolean>;
    /**
     * Starts recording data for the currently active sensor.
     *
     * @remarks
     * This method initiates the recording process based on the active sensor type. Supported sensors include Thermometer,
     * Pulse Oximeter, ECG, Stethoscope, and Otoscope. For sensors like ECG and Stethoscope, this method delegates the
     * recording process to their respective modules.
     */
    private startRecording;
    /**
     * Starts recording data for the currently active sensor.
     */
    StartRecording(): void;
    /**
     * Stops the recording process for the currently active sensor, if applicable.
     *
     * @remarks
     * This method determines the active sensor and stops its recording process accordingly. If no sensor is active,
     * or if the active sensor does not support recording, no action is taken.
     */
    private stopRecording;
    /**
     * Stops the recording process for the currently active sensor, if applicable.
     */
    StopRecording(): void;
    /**
     * Stops the currently active sensor, if any, and performs necessary cleanup operations.
     *
     * @returns `true` if the sensor was successfully stopped or if no sensor was active; otherwise, `false`.
     *
     * @remarks
     * This method determines the active sensor and stops it accordingly. Specific cleanup actions are performed for
     * Stethoscope, Otoscope, and ECG. If the active sensor is `None`, the method returns `true` without performing any actions.
     */
    private stopSensor;
    /**
     * Stops the currently active sensor, if any, and performs necessary cleanup operations.
     */
    StopSensor(): Promise<boolean>;
    /**
     * Disconnects the MedWand device and releases browser serial resources.
     *
     * @remarks
     * This method stops any active sensor, cancels serial receive processing, closes the Web Serial port, and transitions
     * the device state back to `NotConnected`.
     */
    private disconnect;
    /**
     * Disconnects the MedWand device and releases browser serial resources.
     */
    private Disconnect;
    /**
     * Releases all resources used by the `MedWandController` instance.
     *
     * @remarks
     * This method stops active browser media modules, disconnects from the device, rejects pending command responses,
     * and clears event subscriptions.
     */
    private dispose;
    /**
     * Releases all resources used by the `MedWandController` instance.
     */
    Dispose(): void;
    private setLedIntensity;
    private startStethoscope;
    private stopStethoscope;
    private startCamera;
    private stopCamera;
    private startSensor;
    private stopSensorCore;
    private portDataTransmit;
    private commandForTransmit;
    private shouldSendPlainCommand;
    private receiveLoop;
    private processIncomingText;
    private processMessage;
    private applyMessageToState;
    private handleTemperatureMessage;
    private handleSpo2Message;
    private handleEcgMessage;
    private publishReading;
    private waitForMessage;
    private resolvePendingResponses;
    private closeSerialPortResources;
    private rejectPendingResponses;
    private setDeviceState;
    private emitDeviceError;
    private requestSerialPort;
    private isMedWandSerialPort;
    private stethoscopeFilterValueToCommand;
}
export {};