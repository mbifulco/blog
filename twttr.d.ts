// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
declare interface Window {
  twttr: {
    widgets: {
      load: (element: HTMLCollectionOf<Element> | Element) => void;
    };
  };
}
