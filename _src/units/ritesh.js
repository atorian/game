
export default {
    name: 'Ritesh',
    element: 'wind',
    hp: 13500,
    atk: 637,
    def: 604,
    spd: 96,
    cr: 15,
    cd: 50,
    res: 40,
    acc: 0,
    skills: [
        {
            id: 'Crushing Blow',
            power: 30,
            chance: 0,
            target: 'enemy',
            iterations: [
                {
                    enemy_dmg: 'self.atk * 1.1 + self.max_hp * 0.18',
                    taunt: {
                        duration: 1,
                        chance: 50,
                    },
                    haste: {
                        condition: 'is_crit',
                        duration: 2,
                    }
                },
            ]
        },
        {
            id: 'Meditate',
            cooltime: 3,
            target: 'self', // todo: add 50% condition
            iterations: [
                {
                    heal: 'target.max_hp * 0.4',
                },
            ]
        },
        {
            id: 'Trick of Wind',
            cooltime: 4,
            power: 20,
            chance: 25,
            target: 'aoe_enemy',
            iterations: [
                {
                    enemy_dmg: {
                        multiplier: 'self.max_hp * 0.3',
                    },
                    def_break: {
                        duration: 2,
                        chance: 50,
                    }
                }
            ]
        }
    ]
};
