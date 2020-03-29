// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 1325
/** 
Revives an ally target with extremely low HP, evens the HP of the revived ally and yourself and recovers the HP by 15% each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 62
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1325, spec.meta, multistep(spec.action))
}
