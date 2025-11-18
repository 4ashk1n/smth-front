import type { Block } from "./Block";

export type Icon = Block & {
    type: 'icon',
    name: string,
};

export const IconEmpty = {
    type: 'icon',
    name: '',
}