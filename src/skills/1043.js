// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 1043
/** 
Recovers 40% of the MAX HP through meditation. This skill will heal the ally with the lowest HP ratio instead, if your HP is more than 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Heals target with lowest HP if self HP is <50%
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
    return new GenericSkill(1043, spec.meta, multistep(spec.action))
}
