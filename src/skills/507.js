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

// skill id: 507
/** 
Get an extra turn if you kill the enemy. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(507, spec.meta, multistep(spec.action))
}
