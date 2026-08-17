/**
 * Class used to return reading data from MedWand sensor.
 */
export declare class MedWandReading {
    /**
     * DateTime of the reading.
     */
    timeStamp: Date;
    /**
     * Current status of the MedWand device.
     */
    status?: string;
    /**
     * ECG reading offset.
     */
    index: number;
    /**
     * ECG reading values count.
     */
    count: number;
    /**
     * Reading sensor type.
     */
    sensorType?: string;
    /**
     * Temperature ambient value.
     * Will return 'Low' if less than 60.0F
     * Will return 'High' if greater than 104.0F
     */
    tempAmbient?: string;
    /**
     * Temperature fahrenheit value.
     * Will return 'Low' if less than 92.9F
     * Will return 'High' if greater than 107.6F
     */
    tempObject?: string;
    /**
     * SPO2 pulse rate value.
     * Will return 'Low' if less than 25
     * Will return 'High' if greater than 200
     */
    pulseRate?: string;
    /**
     * SPO2 value.
     * Will return 'Low' if less than 70
     * Will return 'High' if greater than 100
     */
    spo2?: string;
    /**
     * ECG sensor data.
     */
    ecgData?: string;
    /**
     * Creates a deep copy of the specified MedWandReading object.
     *
     * This method serializes the input object to JSON and then
     * deserializes it to create a deep copy.
     *
     * @param obj The MedWandReading object to clone.
     * @returns A new instance of MedWandReading that is a deep copy of the input object.
     * @throws Error Thrown if the obj parameter is null or undefined.
     */
    static deepClone<T>(obj: MedWandReading): MedWandReading;
}