declare module angular.base64 {
    export interface IBase64 {
        encode(val : string) : string;
        decode(val : string) : string;
    }
}