// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, multistep, GenericSkill } from "../skill"

// skill id: 188
/** 
Removes the harmful effects on itself and recovers HP accordingly to the number of effects removed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: +10% per debuff removed
        action: [
            step(
                targetSelf,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 30,
        },
    }
    return new GenericSkill(188, spec.meta, multistep(spec.action))
}
