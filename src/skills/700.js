// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 700
/** 
Inflicts damage proportionate to your HP to all enemies and weakens their Attack Power for 2 turns with a 75% chance on each target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemy, debuff(roll, "atk_break", 2, 75))],
        meta: {
            dmg: 30,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(700, spec.meta, multistep(spec.action))
}
