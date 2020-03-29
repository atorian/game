// @flow
import type { Ability } from "../index"
import { step, targetEnemy, multistep, GenericSkill } from "../skill"

// skill id: 344
/** 
When landing as a Critical Hit, this attack additionally inflicts Continuous Damage for 1 turn on the target. If the target dies from this attack, you will heal as much as the amount of damage dealt as the finishing blow. [Automatic Effect] 
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
    return new GenericSkill(344, spec.meta, multistep(spec.action))
}
