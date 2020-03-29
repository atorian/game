// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1321
/** 
Every attack has a 50% chance to Freeze the enemy for 1 turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: When attacked
        action: [step(targetEnemy, debuff(roll, "freeze", 1, 50))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1321, spec.meta, multistep(spec.action))
}
