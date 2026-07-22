/**
 * Represents the various states of the reading process in the MedWand SDK.
 */
export var ReadingState;
(function (ReadingState) {
    /**
     * Indicates that the reading process is stopped and no active operations are being performed.
     */
    ReadingState["Stopped"] = "Stopped";
    /**
     * Indicates that the reading process is in the initial phase of starting.
     */
    ReadingState["Starting"] = "Starting";
    /**
     * Indicates that the reading process has successfully started and is actively running.
     */
    ReadingState["Started"] = "Started";
    /**
     * Indicates the state where the MedWand device is actively relaying readings.
     */
    ReadingState["Reading"] = "Reading";
    /**
     * Indicates that the MedWand SDK is actively recording data during the reading process.
     */
    ReadingState["Recording"] = "Recording";
    /**
     * Indicates that the reading process is in the phase of stopping.
     */
    ReadingState["Stopping"] = "Stopping";
    /**
     * Indicates that an error has occurred during the reading process in the MedWand SDK.
     */
    ReadingState["Error"] = "Error";
})(ReadingState || (ReadingState = {}));
//# sourceMappingURL=enumReadingState.js.map