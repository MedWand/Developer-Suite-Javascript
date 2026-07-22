/**
 * Enumeration for MedWand device/communication errors.
 */
export var ErrorCode;
(function (ErrorCode) {
    /**
     * An unspecified error has occurred.
     */
    ErrorCode["Generic"] = "Generic";
    /**
     * The MedWand device was not found.
     */
    ErrorCode["DeviceNotFound"] = "DeviceNotFound";
    /**
     * The serial port has failed to connect.
     */
    ErrorCode["SerialPortConnectionError"] = "SerialPortConnectionError";
    /**
     * The serial port has failed to open.
     */
    ErrorCode["SerialPortOpenError"] = "SerialPortOpenError";
    /**
     * The serial port has failed.
     */
    ErrorCode["SerialPortError"] = "SerialPortError";
    /**
     * The serial port has failed.
     */
    ErrorCode["SerialPortClosedError"] = "SerialPortClosedError";
    /**
     * The serial port transmission has failed.
     */
    ErrorCode["SerialPortTransmitError"] = "SerialPortTransmitError";
    /**
     * The serial port notification.
     */
    ErrorCode["SerialPortNotification"] = "SerialPortNotification";
})(ErrorCode || (ErrorCode = {}));
/**
 * Represents an error encountered by a MedWand device or during communication with it.
 *
 * This class encapsulates an error code and an associated exception, providing detailed
 * information about the nature of the error. It is used throughout the MedWand SDK to
 * standardize error reporting and handling.
 */
export class MedWandDeviceError {
    /**
     * Error code.
     */
    code;
    /**
     * Exception details.
     */
    exception;
    constructor(code, exception) {
        this.code = code;
        this.exception = exception;
    }
}
//# sourceMappingURL=medWandDeviceError.js.map