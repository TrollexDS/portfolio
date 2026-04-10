import type * as figma from "../../../figma.js";
/**
 * Returns whether the given color is a _transparent black_ (value of the `transparent` keyword).
 *
 * https://www.w3.org/TR/css-color-3/#transparent
 */
export declare function isTransparent({ r, g, b, a }: figma.Color): boolean;
type Vec3 = readonly [number, number, number];
export declare function mmul(a: readonly [Vec3, Vec3, Vec3], b: Vec3): Vec3;
export declare function srgbToDisplayP3(srgb: figma.Color): figma.Color;
export {};
