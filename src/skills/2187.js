// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2187
/** 
Inflicts damage proportionate to your MAX HP to all enemies and decreases their Attack Power for 2 turns and Attack Bar by 15%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "atk_break", 2, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2187, spec.meta, multistep(spec.action))
}
