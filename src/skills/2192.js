// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 2192
/** 
Increases the chance of your attack landing as a Critical Hit by 20%. Stuns the enemy for 1 turn when the attack lands as a Critical Hit with a 50% chance. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "stun", 1, 50))],
        meta: {
            dmg: 0,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(2192, spec.meta, multistep(spec.action))
}
