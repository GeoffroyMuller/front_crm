import type { Breakpoints } from "../types";

export type OnetoTwelve = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GridColumnsOptions =
  | OnetoTwelve
  | {
      // @ts-ignore
      [key: Breakpoints]: OnetoTwelve;
    };

export type AlignItemsOptions =
  | "center"
  | "flex-start"
  | "flex-end"
  | "start"
  | "end"
  | "baseline"
  | "stretch";

export type JustifyContentOptions =
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly"
  | "flex-start"
  | "flex-end"
  | "start"
  | "end"
  | "stretch";

export type FlexWrapOptions = "wrap" | "nowrap" | "initial";
