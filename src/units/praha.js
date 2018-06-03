
export default {
    name: 'Praha',
    element: 'water',
    hp: 11040,
    atk: 692,
    def: 714,
    spd: 100,
    cr: 15,
    cd: 50,
    res: 15,
    acc: 25,
    skills: [
        {
            id: 'Passing Time',
            power: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 1.3',
                    atb_boost: {
                        condition: 'is_crit',
                        value: 15,
                    }
                },
                {
                    enemy_dmg: 'self.atk * 1.3',
                    atb_boost: {
                        condition: 'is_crit',
                        value: 15,
                    }
                },
                {
                    enemy_dmg: 'self.atk * 1.3',
                    atb_boost: {
                        target: 'self',
                        condition: 'is_crit',
                        value: 15,
                    }
                },
            ]
        },
        {
            id: 'Predicted Future',
            power: 30,
            chance: 10,
            cooltime: 3,
            target: 'aoe_enemy',
            iterations: [
                // todo: random iterations
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 300',
                    },
                    strip: 'all',
                },
                {
                    dot: {
                        duration: 2,
                        // amount: x removed buffs
                    },
                }
            ]
        },
        {
            id: 'Daydream',
            cooltime: 4,
            target: 'aoe_ally',
            power: 20,
            iterations: [
                {
                    heal: '50%',
                    sleep: {
                        target: 'self',
                    }
                }
            ]
        }
    ]
};
