
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
            additional_dmg: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * (self.spd + 90) / 55',
                }
            ]
        },
        {
            id: 'Body Slam',
            additional_dmg: 30,
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
                    debufs: [
                        {
                            name: 'def_break',
                            duration: 2
                        },
                        {
                            name: 'atk_break',
                            duration: 2
                        }
                    ]
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
                        aoe: true,
                    },
                    bufs: [
                        {
                            name: 'haste',
                            duration: 2,
                            aoe: true,
                        }
                    ],
                }
            ]
        }
    ]
};
