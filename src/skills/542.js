// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 542
/** 
Reflects 10% of the inflicted damage to the attacker when attacked and provokes the attacker for 1 turn with a 30% chance. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: FIXME: Passive DMG reflect
        action: [step(targetEnemy, debuff(roll, "provoke", 1, null))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(542, spec.meta, multistep(spec.action))
}
