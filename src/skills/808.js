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

// skill id: 808
/** 
Attacks an enemy 3 times with a shimmering light. Each strike has a 30% chance to deter the enemy's HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.3),
                debuff(roll, "heal_block", 2, 30),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(808, spec.meta, multistep(spec.action))
}
