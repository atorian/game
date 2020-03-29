// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 2144
/** 
Removes all harmful effects on the target ally, increases the target's Attack Bar by 25% and recovers its HP. The recovery amount is proportionate to the Attack Power. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.atk * 4.8),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
            recovery: 20,
            atbIncrease: 0.2,
        },
    }
    return new GenericSkill(2144, spec.meta, multistep(spec.action))
}
