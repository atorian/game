// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 544
/** 
Increase the enemy's chances of landing a Glancing Hit by 30% and counterattacks with a 15% chance. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "glancing", null, 30))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(544, spec.meta, multistep(spec.action))
}
