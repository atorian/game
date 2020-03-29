// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    heal,
    debuff,
    atbDecrease,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1653
/** 
Switches the current Attack Bar and HP of the enemy, excluding the Boss, or another ally target and puts yourself into sleep for 1 turn. This effect can't be resisted and ignores the immunity. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                heal((self, target) => self.maxHp * undefined),
                debuff(roll, "sleep", 1, 100),
                atbDecrease(roll, undefined),
            ),
            step(
                targetSelf,
                heal((self, target) => target.maxHp * 1),
                debuff(roll, "sleep", 1, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1653, spec.meta, multistep(spec.action))
}
