/**
 * Class used to return reading data from MedWand sensor.
 */
export class MedWandReading {
    /**
     * DateTime of the reading.
     */
    timeStamp = new Date(0);
    /**
     * Current status of the MedWand device.
     */
    status;
    /**
     * ECG reading offset.
     */
    index = 0;
    /**
     * ECG reading values count.
     */
    count = 0;
    /**
     * Reading sensor type.
     */
    sensorType;
    /**
     * Temperature ambient value.
     * Will return 'Low' if less than 60.0F
     * Will return 'High' if greater than 104.0F
     */
    tempAmbient;
    /**
     * Temperature fahrenheit value.
     * Will return 'Low' if less than 92.9F
     * Will return 'High' if greater than 107.6F
     */
    tempObject;
    /**
     * SPO2 pulse rate value.
     * Will return 'Low' if less than 25
     * Will return 'High' if greater than 200
     */
    pulseRate;
    /**
     * SPO2 value.
     * Will return 'Low' if less than 70
     * Will return 'High' if greater than 100
     */
    spo2;
    /**
     * ECG sensor data.
     */
    ecgData;
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
    static deepClone(obj) {
        if (!obj) {
            throw new Error("obj cannot be null.");
        }
        const clone = Object.assign(new MedWandReading(), JSON.parse(JSON.stringify(obj)));
        // Restore Date object after JSON round-trip
        clone.timeStamp = new Date(clone.timeStamp);
        return clone;
    }
}
//# sourceMappingURL=medWandReading.js.map