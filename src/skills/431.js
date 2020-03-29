// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 431
/** 
Spreads a plague to all enemies that has an 80% chance to inflict 2 Continuous Damage effects that last for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [step(targetEnemies, debuff(roll, "dot", 2, 80))],
        meta: {
            dmg: 0,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(431, spec.meta, multistep(spec.action))
}
