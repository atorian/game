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

// skill id: 1921
/** 
Attacks the enemy target 2 times and attacks all enemies with even more powerful attack on the 3rd attack. Decreases the enemy's attack speed for 2 turns every hit with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "slow", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1921, spec.meta, multistep(spec.action))
}
