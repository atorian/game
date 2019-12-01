import {Battle} from "../battle";

export default class AutoAction {

    constructor() {
        this.units = [];
    }

    subscribe(battle:Battle) {
        battle.dispatcher.on('battle_started', ({teamA, teamB}) => {
            const units = [...teamA, ...teamB].filter(u => u.skills[2] && u.skills[2].passive);
            for (const unit of units) {
                if (unit.skills[2].iterations) {
                    this.units.push(unit.id);
                }
            }
        });

        battle.dispatcher.on('turn_started', ({target}) => {
            if (this.units.includes(target) && battle.units[target].hp > 0) {
                battle.dispatcher.emit('auto_action', {
                    unit: target,
                    skill_id: battle.units[target].skills[2].id,
                });
            }
        });
    }
}
