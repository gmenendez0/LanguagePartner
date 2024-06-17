export interface CreationDTO<T> {
    toBusinessObject: () => Promise<T>;
}