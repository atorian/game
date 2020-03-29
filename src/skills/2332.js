// @flow
import type { Ability } from "../index"
import { step, targetEnemy, debuff, multistep, GenericSkill } from "../skill"

// skill id: 2332
/** 
Inflicts 12% of my MAX HP as damage when you're attacked with a critical hit. Inflicts Continuous Damage for 1 turn with a 50% chance and weakens the Defense for 1 turn with every attack. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetEnemy,
                debuff(roll, "dot", 1, 50),
                debuff(roll, "def_break", 1, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2332, spec.meta, multistep(spec.action))
}
