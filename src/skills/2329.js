// @flow
import type { Ability } from "../index"
import { step, targetSelf, heal, multistep, GenericSkill } from "../skill"

// skill id: 2329
/** 
Recovers HP by 10% every turn. The recovery effects that you receive increases by 100%. [Automatic Effect] 
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
    return new GenericSkill(2329, spec.meta, multistep(spec.action))
}
