/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'react-facebook-pixel' {
  export default class ReactPixel {
    static init(pixelId: string, advancedMatching?: any, options?: any): void;
    static pageView(): void;
    static track(title: string, data?: any): void;
    static trackCustom(event: string, data?: any): void;
    static grantConsent(): void;
    static revokeConsent(): void;
  }
}
