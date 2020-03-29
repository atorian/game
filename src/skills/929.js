// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 929
/** 
Fills up the Attack Bar of an ally target and yourself and recovers HP by 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => target.maxHp * 0.5),
            ),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 0.5),
                atbIncrease(100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 20,
        },
    }
    return new GenericSkill(929, spec.meta, multistep(spec.action))
}
