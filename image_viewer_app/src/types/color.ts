type HexDigit =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F";

type ColorHex<T extends string> =
  T extends `#${HexDigit}${HexDigit}${HexDigit}${infer Rest}`
    ? Rest extends ``
      ? T
      : Rest extends `${HexDigit}${HexDigit}${HexDigit}`
      ? T
      : never
    : never;

type ColorRGB<T extends string> = T extends `rgb(${number},${number},${number})`
  ? T
  : never;

type ColorRGBA<T extends string> =
  T extends `rgba(${number},${number},${number},${number})` ? T : never;

export type Color = string & { __type: "Color" };

export const color = <T extends string>(
  w: ColorHex<T> | ColorRGB<T> | ColorRGBA<T>
): Color => {
  return w as string as Color;
};
