/**
 * Enumeration for MedWand device/communication errors.
 */
export declare enum ErrorCode {
    /**
     * An unspecified error has occurred.
     */
    Generic = "Generic",
    /**
     * The MedWand device was not found.
     */
    DeviceNotFound = "DeviceNotFound",
    /**
     * The serial port has failed to connect.
     */
    SerialPortConnectionError = "SerialPortConnectionError",
    /**
     * The serial port has failed to open.
     */
    SerialPortOpenError = "SerialPortOpenError",
    /**
     * The serial port has failed.
     */
    SerialPortError = "SerialPortError",
    /**
     * The serial port has failed.
     */
    SerialPortClosedError = "SerialPortClosedError",
    /**
     * The serial port transmission has failed.
     */
    SerialPortTransmitError = "SerialPortTransmitError",
    /**
     * The serial port notification.
     */
    SerialPortNotification = "SerialPortNotification"
}
/**
 * Represents an error encountered by a MedWand device or during communication with it.
 *
 * This class encapsulates an error code and an associated exception, providing detailed
 * information about the nature of the error. It is used throughout the MedWand SDK to
 * standardize error reporting and handling.
 */
export declare class MedWandDeviceError {
    /**
     * Error code.
     */
    readonly code: ErrorCode;
    /**
     * Exception details.
     */
    readonly exception: Error;
    constructor(code: ErrorCode, exception: Error);
}