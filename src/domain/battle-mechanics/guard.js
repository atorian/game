import {Battle} from "../battle";


export function onDeath(battle, units) {
    return ({target}) => {
        if (units.includes(target) && battle.units[target].hp === 0) {
            const skill = battle.units[target].skills[2];
            if (battle.units[target].cooldowns[skill.id] === 0) {
                    battle.dispatcher.emit('guard_triggered', {
                    unit_id: target,
                    skill_id: skill.id,
                    target_id: target,
                    guard: true
                });
            }
        }
    }
}

export default class Guard {

    constructor() {
        this.death = [];
    }

    subscribe(battle: Battle) {
        this.battle = battle;
        battle.dispatcher.on('battle_started', ({teamA, teamB}) => {
            const units = [...teamA, ...teamB].filter(u => u.skills[2] && u.skills[2].passive);
            for (const unit of units) {
                if (unit.skills[2].guard) {
                    if (unit.skills[2].guard.on === 'death') {
                        this.death.push(unit.id);
                    }
                }
            }
        });

        // todo: watch DOTs as well
        battle.dispatcher.on('hit', onDeath(battle, this.death));
    }
}
