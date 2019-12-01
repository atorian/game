// @flow
import type { Unit } from "./index";
import { DARK, FIRE, LIGHT, WATER, WIND } from "./index";

const DEFAULT_TOWER_MULTIPLIERS = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const TowerMultipliers = {
    def: DEFAULT_TOWER_MULTIPLIERS,
    atk: DEFAULT_TOWER_MULTIPLIERS,
    wind_atk: DEFAULT_TOWER_MULTIPLIERS,
    fire_atk: DEFAULT_TOWER_MULTIPLIERS,
    water_atk: DEFAULT_TOWER_MULTIPLIERS,
    light_atk: DEFAULT_TOWER_MULTIPLIERS,
    dark_atk: DEFAULT_TOWER_MULTIPLIERS,
    hp: DEFAULT_TOWER_MULTIPLIERS,
    cd: [2, 5, 7, 10, 12, 15, 17, 20, 22, 25],
    spd: [2, 3, 5, 6, 8, 9, 11, 12, 14, 15],
};

const MAX_TOWER_LVL = 10;

export const GloryTowers = {

    towers: {
        "player-id": { // Towers
            def: MAX_TOWER_LVL,
            atk: MAX_TOWER_LVL,
            wind_atk: MAX_TOWER_LVL,
            fire_atk: MAX_TOWER_LVL,
            water_atk: MAX_TOWER_LVL,
            light_atk: MAX_TOWER_LVL,
            dark_atk: MAX_TOWER_LVL,
            hp: MAX_TOWER_LVL,
            cd: MAX_TOWER_LVL,
            spd: MAX_TOWER_LVL,
        }
    },

    apply(unit: Unit) {
        const towers = this.towers[unit.player];

        let res = {
            atk: TowerMultipliers.atk[towers.atk - 1] * unit.atk / 100,
            def: TowerMultipliers.def[towers.def - 1] * unit.def / 100,
            hp: TowerMultipliers.hp[towers.hp - 1] * unit.hp / 100,
            spd: TowerMultipliers.spd[towers.spd - 1] * unit.spd / 100,
            cd: TowerMultipliers.cd[towers.cd - 1],
        };

        switch (unit.element) {
            case WIND:
                res.atk = res.atk + TowerMultipliers.wind_atk[towers.wind_atk - 1] * unit.atk / 100;
                break;
            case FIRE:
                res.atk = res.atk + TowerMultipliers.fire_atk[towers.fire_atk - 1] * unit.atk / 100;
                break;
            case WATER:
                res.atk = res.atk + TowerMultipliers.water_atk[towers.water_atk - 1] * unit.atk / 100;
                break;
            case LIGHT:
                res.atk = res.atk + TowerMultipliers.light_atk[towers.light_atk - 1] * unit.atk / 100;
                break;
            case DARK:
                res.atk = res.atk + TowerMultipliers.dark_atk[towers.dark_atk - 1] * unit.atk / 100;
                break;
        }

        return res;
    }
};

export const GuildFlags = {

    towers: {
        "player-id": {
            def: MAX_TOWER_LVL,
            atk: MAX_TOWER_LVL,
            hp: MAX_TOWER_LVL,
            cd: MAX_TOWER_LVL,
        }
    },

    apply(unit: Unit) {
        const towers = this.towers[unit.player];

        return {
            cd: TowerMultipliers.cd[towers.cd - 1],
            atk: TowerMultipliers.atk[towers.atk - 1] * unit.atk / 100,
            def: TowerMultipliers.def[towers.def - 1] * unit.def / 100,
            hp: TowerMultipliers.hp[towers.hp - 1] * unit.hp / 100,
            currentHP: TowerMultipliers.hp[towers.hp - 1] * unit.hp / 100,
        };
    }
};
