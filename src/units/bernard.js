
export default {
    name: 'Bernard',
    element: 'wind',
    hp: 10380,
    atk: 417,
    def: 703,
    spd: 111,
    cr: 15,
    cd: 50,
    res: 15,
    acc: 0,
    skills: [
        {
            id: 'Snatch',
            power: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * (self.spd + 90) / 55',
                }
            ]
        },
        {
            id: 'Body Slam',
            power: 30,
            cooltime: 2,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: {
                        multiplier: 'self.atk * 5.10',
                        target: 'enemy',
                        ignore_def: false,
                        ignore_bufs: false,
                    },
                    def_break: 2,
                    atk_break: 2,
                }
            ]
        },
        {
            id: 'Tailwind',
            cooltime: 3,
            target: 'aoe_ally',
            iterations: [
                {
                    atb_boost: {
                        value: 30,
                    },
                    haste: 2,
                }
            ]
        }
    ]
};
