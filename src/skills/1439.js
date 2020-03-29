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

// skill id: 1439
/** 
Attacks the enemy 2 times and increases the chances of the enemy to land a Glancing Hit for 2 turns with a 30% chance on each strike. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                debuff(roll, "glancing", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.8),
                debuff(roll, "glancing", 2, 30),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1439, spec.meta, multistep(spec.action))
}
