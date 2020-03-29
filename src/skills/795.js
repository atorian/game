// @flow
import type { Ability } from "../index"
import { step, targetAlly, heal, multistep, GenericSkill } from "../skill"

// skill id: 795
/** 
Reduces the time of all harmful effects, except inability effects, granted on all allies by 1 turn and recovers the ally with the lowest HP status by 10% of your HP every turn. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Unknown effect: 53
        // fixme: Except inability effects
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
            recovery: 20,
        },
    }
    return new GenericSkill(795, spec.meta, multistep(spec.action))
}
