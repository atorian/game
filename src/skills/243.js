// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 243
/** 
Inflicts damage proportional to your MAX HP to all enemies and decreases their Attack Power for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemies, debuff(roll, "atk_break", 2, 100))],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(243, spec.meta, multistep(spec.action))
}
