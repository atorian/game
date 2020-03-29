// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1936
/** 
Provokes all enemies for 2 turns and instantly recovers a turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemies, debuff(roll, "provoke", 2, 100)),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1936, spec.meta, multistep(spec.action))
}
