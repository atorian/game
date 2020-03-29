// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 997
/** 
Attacks all enemies with a dark pillar and decreases the Attack Bar by 30% with a 50% chance. Additionally, this attack will heal an ally with the lowest HP by 25%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Party member with lowest HP
        action: [
            step(
                targetAlly,
                heal((self, target) => self.atk * 2.8),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(997, spec.meta, multistep(spec.action))
}
