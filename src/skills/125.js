// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 125
/** 
Attacks the enemy target and recovers the HP of an ally with the lowest HP ratio by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Ally with lowest % HP
        action: [
            step(
                targetAlly,
                heal((self, target) => self.atk * 3.5),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(125, spec.meta, multistep(spec.action))
}
