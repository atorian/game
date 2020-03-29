// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 764
/** 
Gains a turn with a 15% chance whenever an enemy's turn ends. If this effect doesn't activate, the activation chance will be increased. If this effect is activated, the increased activation chance will be reset and your Attack Power and Critical Rate will be increased for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(764, spec.meta, multistep(spec.action))
}
