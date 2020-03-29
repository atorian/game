// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1166
/** 
Removes all harmful effects if you start the turn with harmful effects. Recovers HP of all allies by 10% of your MAX HP for each removed harmful effect. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: At the start of every turn
        // fixme: 10% per debuff removed
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1166, spec.meta, multistep(spec.action))
}
