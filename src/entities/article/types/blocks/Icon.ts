import type { Block } from "./Block";

export type Icon = Block & {
    name: string,
    depth: number
};