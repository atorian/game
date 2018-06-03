
export default {
    name: 'Bastet',
    element: 'water',
    hp: 11850,
    atk: 637,
    def: 714,
    spd: 99,
    cr: 15,
    cd: 50,
    res: 40,
    acc: 0,
    skills: [
        {
            id: 'Touch of Seduction',
            power: 15,
            chance: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 4',
                    atk_break: {
                        chance: 50,
                    }
                }
            ]
        },
        {
            id: 'Curse of the Beautiful',
            power: 15,
            chance: 25,
            cooltime: 4,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 1',
                    def_break: {
                        chance: 50,
                        duration: 2,
                    },
                },
                {
                    enemy_dmg: 'self.atk * 1',
                    glancing: {
                        chance: 50,
                        duration: 2,
                    },
                },
                {
                    enemy_dmg: 'self.atk * 1',
                    unrecoverable: {
                        chance: 50,
                        duration: 2,
                    },
                },
            ]
        },
        {
            id: 'Oasis\'s Blessing',
            cooltime: 4,
            power: 20,
            target: 'aoe_ally',
            iterations: [
                {
                    atb_boost: 25,
                    atk_buf: 2,
                    shield: {
                        value: '120 * self.lvl',
                        duration: 2,
                    }
                }
            ]
        }
    ]
};
