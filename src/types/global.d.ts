export {};

declare global {
  interface DataLayerEvent {
    event: string;
    [key: string]: unknown;
  }

  interface Window {
    dataLayer: DataLayerEvent[];
  }
}