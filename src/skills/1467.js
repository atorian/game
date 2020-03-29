// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1467
/** 
Decreases the incoming damage by 35% and increases the damage dealt by 50% if the enemy has lower Attack Power than yours. Recovers the HP by 30% of the damage dealt with every attack during your turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [step(targetEnemy, debuff(roll, "atk_break", 2, 100))],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            recovery: 20,
        },
    }
    return new GenericSkill(1467, spec.meta, multistep(spec.action))
}
