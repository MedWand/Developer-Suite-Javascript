/**
 * Represents the various states of a device within the device state machine.
 */
export declare enum DeviceState {
    /**
     * Indicates that the device is not currently connected.
     */
    NotConnected = "NotConnected",
    /**
     * Indicates that the device is in the process of establishing a connection.
     */
    Connecting = "Connecting",
    /**
     * Indicates that the device is successfully connected and ready for further operations.
     */
    Connected = "Connected",
    /**
     * Indicates that the device is in the process of initializing.
     * This state occurs after the device has connected but before it is fully initialized.
     */
    Initializing = "Initializing",
    /**
     * Indicates that the device has completed the initialization process
     * and is ready for operation.
     */
    Initialized = "Initialized",
    /**
     * Represents the state where the device is in the process of disconnecting from its current connection.
     */
    DisConnecting = "DisConnecting",
    /**
     * Represents an error state in the device state machine, indicating that the device has encountered an issue.
     */
    Error = "Error"
}