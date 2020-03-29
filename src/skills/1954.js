// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1954
/** 
The Accuracy will be increased by 25%. Weakens the enemy's Defense for 1 turn with every attack. If there's Boomerang Warrior included in the ally team, the Boomerang Warrior's Accuracy will also be increased by 25%. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Enemies with debuffs only
        action: [
            step(
                targetAlly,
                debuff(roll, "def_break", 1, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1954, spec.meta, multistep(spec.action))
}
