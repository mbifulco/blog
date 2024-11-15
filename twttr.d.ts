/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare interface Window {
  twttr?: {
    widgets?: {
      load?: (document: Document | HTMLCollectionOf<Element>) => void;
    };
  };
}
