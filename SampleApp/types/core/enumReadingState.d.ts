/**
 * Represents the various states of the reading process in the MedWand SDK.
 */
export declare enum ReadingState {
    /**
     * Indicates that the reading process is stopped and no active operations are being performed.
     */
    Stopped = "Stopped",
    /**
     * Indicates that the reading process is in the initial phase of starting.
     */
    Starting = "Starting",
    /**
     * Indicates that the reading process has successfully started and is actively running.
     */
    Started = "Started",
    /**
     * Indicates the state where the MedWand device is actively relaying readings.
     */
    Reading = "Reading",
    /**
     * Indicates that the MedWand SDK is actively recording data during the reading process.
     */
    Recording = "Recording",
    /**
     * Indicates that the reading process is in the phase of stopping.
     */
    Stopping = "Stopping",
    /**
     * Indicates that an error has occurred during the reading process in the MedWand SDK.
     */
    Error = "Error"
}