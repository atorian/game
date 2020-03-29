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

// skill id: 247
/** 
Attacks an enemy 2 times with fast punches. Each punch has a 50% chance to decrease the enemy's Attack Speed for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.9 + attacker.atk + 20,
                ),
                debuff(roll, "slow", 1, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.9 + attacker.atk + 20,
                ),
                debuff(roll, "slow", 1, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(247, spec.meta, multistep(spec.action))
}
