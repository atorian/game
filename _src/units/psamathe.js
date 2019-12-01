
export default {
    name: 'Psamathe',
    element: 'water',
    hp: 9720,
    atk: 856,
    def: 637,
    spd: 98,
    cr: 30,
    cd: 50,
    res: 40,
    acc: 0,
    skills: [
        {
            id: 'Serenity',
            power: 25,
            chance: 20,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 1.8',
                    strip: {
                        chance: 30,
                        amount: 1,
                    }
                },
                {
                    enemy_dmg: 'self.atk * 1.8',
                    strip: {
                        chance: 30,
                        amount: 1,
                    }
                }
            ]
        },
        {
            id: 'Overwhelm',
            power: 20,
            chance: 10,
            cooltime: 3,
            target: 'aoe_enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 3.2',
                    skill_reset: {
                        chance: 70,
                        duration: 1,
                    },
                },
            ]
        },
        {
            id: 'Rageful Return',
            passive: true,
            cooltime: 6,
            power: 20,
            target: 'self',
            guard: {
                on: 'death',
                target: 'self',
                iterations: [
                    {
                        revive: {
                            heal: 'self.max_hp * 0.3',
                        }
                    },
                    {
                        enemy_dmg: {
                            multiplier: 'self.atk * 3.2',
                            target: 'aoe_enemy',
                        },
                    }
                ]
            }
        }
    ]
};
