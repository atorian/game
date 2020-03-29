// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 1485
/** 
Recovers the HP of the 2 allies with the lowest HP ratio by 25% and 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Lowest HP party member
        // fixme: Second lowest HP party member
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(1485, spec.meta, multistep(spec.action))
}
