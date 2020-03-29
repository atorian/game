// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 130
/** 
Removes all of the harmful effects on you and the target ally and recovers 20% of your HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => target.maxHp * 0.2),
            ),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.2),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 2,
            recovery: 30,
        },
    }
    return new GenericSkill(130, spec.meta, multistep(spec.action))
}
