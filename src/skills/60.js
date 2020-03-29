// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 60
/** 
Removes all harmful effects on the target ally and recovers its HP. The recovery amount is proportionate to the Attack Power. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.atk * 4),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
            recovery: 30,
        },
    }
    return new GenericSkill(60, spec.meta, multistep(spec.action))
}
