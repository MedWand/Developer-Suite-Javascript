export type EventMap = Record<string, unknown>;
export type EventHandler<T> = (payload: T) => void;
export declare class TypedEventTarget<TEvents extends EventMap> {
    private readonly listeners;
    on<TKey extends keyof TEvents>(eventName: TKey, handler: EventHandler<TEvents[TKey]>): () => void;
    off<TKey extends keyof TEvents>(eventName: TKey, handler: EventHandler<TEvents[TKey]>): void;
    protected emit<TKey extends keyof TEvents>(eventName: TKey, payload: TEvents[TKey]): void;
    protected removeAllListeners(): void;
}