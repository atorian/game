import {aoe_enemy} from "../mechanics/targeting";
import type {ActionContext} from "../battle";

export default {
    name: 'Lushen',
    element: 'wind',
    hp: 9225,
    atk: 900,
    def: 461,
    spd: 103,
    cr: 15,
    cd: 50,
    res: 15,
    acc: 0,
    skills: [
        {
            id: 'Flying Cards',
            target: 'enemy',
            power: 20,
            chance: 30,
            iterations: [
                {
                    enemy_dmg: 'self.atk * 3.6',
                    unrecoverable: {
                        duration: 2,
                        chance: 70,
                    },
                }
            ]
        },
        {
            id: 'Surprise Box',
            cooltime: 3,
            power: 25,
            target: 'aoe_enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 2.40',
                },
                {
                    random_debuf: [
                        {stun: 1,},
                        {glancing: 1,},
                        {slow: 1,},
                    ]
                }
            ]
        },
        {
            id: 'Amputation Magic',
            cooltime: 4,
            target: 'aoe_enemy',
            power: 30,
            iterations: [
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 0.68',
                        ignore_def: true
                    },
                },
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 0.68',
                        ignore_def: true
                    },
                },
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 0.68',
                        ignore_def: true
                    },
                }
            ]
        }
    ]
};
