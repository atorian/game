
export default {
    name: 'Perna',
    element: 'fire',
    hp: 12345,
    atk: 878,
    def: 439,
    spd: 109,
    cr: 15,
    cd: 50,
    res: 40,
    acc: 0,
    skills: [
        {
            id: 'Arcane Blast',
            power: 30,
            chance: 30,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 4.2',
                    stun: {
                        chance: 18,
                        duration: 1,
                    }
                },
            ]
        },
        {
            id: 'Flame Nova',
            cooltime: 2,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * (5 + 4 * target.hp / target.max_hp)', // todo: add progression based on enemy hp
                },
            ]
        },
        {
            id: 'Eternity',
            passive: true,
            cooltime: 8,
            guard: {
                on: 'death',
                target: 'self',
                iterations: [
                    {
                        revive: {
                            heal: 'self.max_hp'
                        }
                    }
                ]
            },
            // actions does not trigger cooldowns
            iterations: [
                {
                    heal: {
                        target: 'not_self',
                        value: 'target.max_hp * 0.1'
                    }
                }
            ]
        }
    ]
};
