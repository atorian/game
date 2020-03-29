// @flow
import type { Ability } from "../index"
import { step, targetSelf, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1324
/** 
Becomes immune to Continuous Damage. When being attacked, the attackers will suffer Continuous Damage for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetSelf, debuff(roll, "dot", 1, null))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1324, spec.meta, multistep(spec.action))
}
