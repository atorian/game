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
            additional_dmg: 20,
            additional_chance: 30,
            iterations: [
                {
                    enemy_dmg: 'self.atk * 3.6',
                    debufs: [
                        {
                            name: 'unrecoverable',
                            duration: 2,
                            chance: 70
                        }
                    ]
                }
            ]
        },
        {
            id: 'Surprise Box',
            cooltime: 3,
            additional_dmg: 25,
            target: 'aoe_enemy',
            iterations: [
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 2.40',
                    },
                    debufs: [
                        {
                            random: ['stun', 'glancing', 'slow'],
                            duration: 1
                        },
                    ]
                }
            ]
        },
        {
            id: 'Amputation Magic',
            cooltime: 4,
            target: 'aoe_enemy',
            additional_dmg: 30,
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
