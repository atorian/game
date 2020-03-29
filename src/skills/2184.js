// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 2184
/** 
Inflicts damage proportionate to your MAX HP to all enemies and decreases their Attack Power for 2 turns and provokes all enemies for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "atk_break", 2, 100),
                debuff(roll, "provoke", 1, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2184, spec.meta, multistep(spec.action))
}
