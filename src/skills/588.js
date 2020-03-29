// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, multistep, GenericSkill } from "../skill"

// skill id: 588
/** 
Recovers by 10% every turn and your attack speed increases as your HP decreases. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetSelf,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(588, spec.meta, multistep(spec.action))
}
