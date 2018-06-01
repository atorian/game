
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
            additional_dmg: 30,
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
                        condition: 'is_crit',
                        value: 15,
                    }
                },
            ]
        },
        {
            id: 'Predicted Future',
            additional_dmg: 30,
            additional_chance: 10,
            cooltime: 3,
            target: 'aoe_enemy',
            iterations: [
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 300',
                    },
                    strip: {
                        amount: 'all',
                    }
                },
                {
                    debufs: [
                        {
                            effect: 'dot',
                            duration: 2
                        },
                    ]
                }
            ]
        },
        {
            id: 'Daydream',
            cooltime: 4,
            target: 'aoe_ally',
            additional_dmg: 20,
            iterations: [
                {
                    heal: '50%',
                    debufs: [
                        {
                            effect: 'sleep',
                            target: 'self',
                            duration: 1,
                        }
                    ],
                }
            ]
        }
    ]
};
