const skill3 = {
    id: 'GLARING MISTS (PASSIVE)',
    passive: true,
    aura: {
        affects: 'enemy',
        glancing_chance: 20
    },
    iterations: [{
        target: 'ally with lowest hp',
        heal: '10%'
    }]
};


const bodygard = {
    id: 'Body Guard',
    passive: true,
    guard: {
        target: 'ally with lowest hp',
        shield: 'self.hp * 0.10',
    }
};

const hwadam_bodygard = {
    id: 'Body Guard',
    passive: true,
    guard: {
        target: 'ally',
        condition: 'ally.hp == 0',
        heal: 'self.hp * 0.10'
    }
};

const panda = {
    id: 'Winds and Clouds',
    passive: true,
    power: {
        multiplier: 'self.def * 1.6',
    },
    guard: {
        target: 'self',
        atb_increase: 20,
    }
};
