// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 790
/** 
Recovers the HP and Attack Bar of an ally target by 30% each. This skill may revive a dead ally with 30% HP at the cost of 3 additional turns being added to the cool time. 
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
            cooldown: 3,
            recovery: 20,
        },
    }
    return new GenericSkill(790, spec.meta, multistep(spec.action))
}
