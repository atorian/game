
export default {
    name: 'Megan',
    element: 'water',
    hp: 9885,
    atk: 582,
    def: 571,
    spd: 97,
    cr: 15,
    cd: 50,
    res: 15,
    acc: 0,
    skills: [
        {
            id: 'Crow Summoning',
            additional_dmg: 30,
            additional_chance: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 3.6',
                    debufs: [
                        {
                            effect: 'dot',
                            chance: 50,
                        }
                    ]
                }
            ]
        },
        {
            id: 'Toad Poison',
            additional_dmg: 30,
            additional_chance: 25,
            cooltime: 3,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 5.30',
                    },
                    debufs: [
                        {
                            effect: 'block_buf',
                            duration: 1,
                            chance: 75
                        }
                    ],
                    strip: {
                        amount: 1,
                    }
                }
            ]
        },
        {
            id: 'Spell of Strengthening',
            cooltime: 4,
            target: 'aoe_ally',
            iterations: [
                {
                    atb_boost: {
                        value: 20,
                    },
                    bufs: [
                        {
                            effect: 'atk_buf',
                            duration: 2,
                        },
                        {
                            effect: 'def_buf',
                            duration: 2,
                        }
                    ],
                }
            ]
        }
    ]
};
