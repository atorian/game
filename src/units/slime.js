
export default {
    name: 'Slime',
    element: 'water',
    hp: 450,
    atk: 30,
    def: 60,
    spd: 102,
    cr: 15,
    cd: 50,
    res: 15,
    acc: 0,
    skills: [
        {
            id: 'Jump Slam',
            target: 'enemy',
            power: 0,
            chance: 0,
            iterations: [
                {
                    enemy_dmg: 'self.atk * 3.3 + 35',
                    slow: {
                        chance: 30
                    },
                }
            ]
        }
    ]
};
