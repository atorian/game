// @flow
import type { Ability } from "../index"
import { step, targetEnemies, debuff, multistep, GenericSkill } from "../skill"

// skill id: 1647
/** 
Puts all enemies to sleep for 1 turn with a 50% chance and inflicts Continuous Damage for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                debuff(roll, "sleep", 1, 50),
                debuff(roll, "dot", 2, 50),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1647, spec.meta, multistep(spec.action))
}
