// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 1650
/** 
Evens the HP of the enemy target, excluding the Boss, and the ally with the lowest HP. Decreases the HP of the enemy target by 15% and recovers the HP of the ally target by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1650, spec.meta, multistep(spec.action))
}
