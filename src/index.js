import Contestant from "./contestant";

export type Stats = {
    hp: number;
    atk: number;
    def: number;
    spd: number;
    cr: number;
    cd: number;
    res: number;
    acc: number;
}

export type Unit = {
    id: string;
    player: string;
    element: string;
    skills: number[];
} & Stats

export type Player = {
    id: string
}

export interface Ability {
    cooldown: number;
    cast(caster: Contestant, target: string, units: Contestant[]): void;
    refresh(number): void;
}

export const WIND = Symbol('wind');
export const FIRE = Symbol('fire');
export const WATER = Symbol('water');
export const LIGHT = Symbol('light');
export const DARK = Symbol('dark');
