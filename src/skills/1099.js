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

// skill id: 1099
/** 
Attacks the enemy with a sharp blade and inflicts continuous damage for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "dot", 2, 50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1099, spec.meta, multistep(spec.action))
}
