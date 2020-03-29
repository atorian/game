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

// skill id: 807
/** 
Attacks an enemy 3 times with a shimmering light. Each strike has a 15% chance of increasing the enemy's chance of landing a Glancing Hit for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "glancing", 2, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "glancing", 2, 15),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "glancing", 2, 15),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(807, spec.meta, multistep(spec.action))
}
