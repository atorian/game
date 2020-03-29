// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2220
/** 
Deals damage proportionate to your Defense to the enemy target. If the target dies, you instantly gain another turn. The damage also increases as the enemy's HP status decreases. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Cant parse dmg multiplier: DEF,Target Current HP %
        action: [
            step(targetEnemy),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2220, spec.meta, multistep(spec.action))
}
