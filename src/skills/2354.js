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

// skill id: 2354
/** 
Increases the critical rate for 3 turns and counterattacks when attacked. The Attack Bar is increased by 50%, and the damage you receive will be reduced by half when you get attacked while this skill is on cooldown. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 59
        // fixme: While on cooldown
        action: [
            step(targetEnemy),
            step(
                targetSelf,
                buff((self, target) => target.buf("cr", 3)),
                buff((self, target) => target.buf("counterAtk", 3)),
                atbIncrease(50),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            atbIncrease: 0.2,
        },
    }
    return new GenericSkill(2354, spec.meta, multistep(spec.action))
}
