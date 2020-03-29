// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 479
/** 
Embraces the power of thunder, granting all attacks a 50% chance to stun the target. Stuns the target with a 100% chance if you get a Critical Hit. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Duplicate debuffs
        // fixme: Grants chance to stun to ally
        action: [
            step(
                targetEnemy,
                debuff(roll, "stun", 1, 50),
                debuff(roll, "stun", 1, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(479, spec.meta, multistep(spec.action))
}
