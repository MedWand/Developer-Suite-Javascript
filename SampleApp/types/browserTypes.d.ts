export type SerialPortRequestOptions = {
    filters?: Array<{
        usbVendorId?: number;
        usbProductId?: number;
    }>;
};
export type SerialPortInfo = {
    usbVendorId?: number;
    usbProductId?: number;
};
export type SerialOptions = {
    baudRate: number;
    dataBits?: 7 | 8;
    stopBits?: 1 | 2;
    parity?: "none" | "even" | "odd";
    bufferSize?: number;
    flowControl?: "none" | "hardware";
};
export type BrowserSerialPort = {
    readable: ReadableStream<Uint8Array> | null;
    writable: WritableStream<Uint8Array> | null;
    open(options: SerialOptions): Promise<void>;
    close(): Promise<void>;
    getInfo(): SerialPortInfo;
    setSignals?(signals: {
        dataTerminalReady?: boolean;
        requestToSend?: boolean;
        break?: boolean;
    }): Promise<void>;
};
export type BrowserSerial = {
    requestPort(options?: SerialPortRequestOptions): Promise<BrowserSerialPort>;
    getPorts(): Promise<BrowserSerialPort[]>;
};
declare global {
    interface Navigator {
        serial?: BrowserSerial;
    }
}