
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
            power: 30,
            chance: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 3.6',
                    dot: {
                        chance: 50,
                    }
                }
            ]
        },
        {
            id: 'Toad Poison',
            power: 30,
            chance: 25,
            cooltime: 3,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 5.30',
                    strip: 1,
                },
                {
                    block_buf: {
                        chance: 75,
                    },
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
                    atk_buf: 2,
                    def_buf: 2,
                }
            ]
        }
    ]
};
