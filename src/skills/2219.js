// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    onKill,
    additionalTurn,
    skillRefresh,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2219
/** 
If you kill the enemy, you will get an extra turn instantly and your skill cooldown time will decrease by 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                onKill(additionalTurn(roll, 100)),
                skillRefresh(1),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2219, spec.meta, multistep(spec.action))
}
