// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1403
/** 
Throws a condensed cloud of elements at the enemy to attack 2 times and reduces the enemy's Attack Power for 2 turns with a 20% chance for each attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "atk_break", 2, 20),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "atk_break", 2, 20),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(1403, spec.meta, multistep(spec.action))
}
