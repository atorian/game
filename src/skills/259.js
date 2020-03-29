// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    targetSelf,
    buff,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 259
/** 
You reflect 10% of damage back to the enemy and fill up your Attack Bar by 30% every time you're attacked. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: FIXME: Passive DMG reflect
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("reflectDmg", 10)),
                atbIncrease(30),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(259, spec.meta, multistep(spec.action))
}
