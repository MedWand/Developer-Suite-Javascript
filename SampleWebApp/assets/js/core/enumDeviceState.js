/**
 * Represents the various states of a device within the device state machine.
 */
export var DeviceState;
(function (DeviceState) {
    /**
     * Indicates that the device is not currently connected.
     */
    DeviceState["NotConnected"] = "NotConnected";
    /**
     * Indicates that the device is in the process of establishing a connection.
     */
    DeviceState["Connecting"] = "Connecting";
    /**
     * Indicates that the device is successfully connected and ready for further operations.
     */
    DeviceState["Connected"] = "Connected";
    /**
     * Indicates that the device is in the process of initializing.
     * This state occurs after the device has connected but before it is fully initialized.
     */
    DeviceState["Initializing"] = "Initializing";
    /**
     * Indicates that the device has completed the initialization process
     * and is ready for operation.
     */
    DeviceState["Initialized"] = "Initialized";
    /**
     * Represents the state where the device is in the process of disconnecting from its current connection.
     */
    DeviceState["DisConnecting"] = "DisConnecting";
    /**
     * Represents an error state in the device state machine, indicating that the device has encountered an issue.
     */
    DeviceState["Error"] = "Error";
})(DeviceState || (DeviceState = {}));
//# sourceMappingURL=enumDeviceState.js.map