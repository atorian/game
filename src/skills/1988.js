// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1988
/** 
Inflicts Continuous Damage on the target for 2 turns with every attack. If you attack an enemy who already has Continuous Damage, additionally inflicts Continuous Damage for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "dot", 2, null))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1988, spec.meta, multistep(spec.action))
}
