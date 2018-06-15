

export class Player {
    constructor(id) {
        this.id = id;
        this.arena_totems = [
            { stat: 'atk', value: 0.2 },
            { stat: 'atk_fire', value: 0.21 },
            { stat: 'atk_wind', value: 0.21 },
            { stat: 'atk_water', value: 0.21 },
            { stat: 'def', value: 0.2 },
            { stat: 'hp', value: 0.2 },
            { stat: 'spd', value: 0.15 },
            { stat: 'cd', value: 25 },
        ];
        this.gw_totems = [];
        this.presets = [/** units summoned by user */];
    }
}

const all_units = [/** collection of all available in the game units */];

const builds = [];

