// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 1027
/** 
Recovers an ally's HP by 50%. 
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
        },
    }
    return new GenericSkill(1027, spec.meta, multistep(spec.action))
}
