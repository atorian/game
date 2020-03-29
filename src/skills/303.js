// @flow
import type { Ability } from "../index"
import { step, targetAllies, heal, multistep, GenericSkill } from "../skill"

// skill id: 303
/** 
Recovers all allies by 20% of my MAX HP if you get a critical hit when you attack on your turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(303, spec.meta, multistep(spec.action))
}
