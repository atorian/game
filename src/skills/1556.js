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

// skill id: 1556
/** 
Shoots the enemy with lightning speed 6 times. Each shot has a 65% chance to inflict a continuous damage effect that lasts for 1 turn on the target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "dot", 1, 65),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "dot", 1, 65),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "dot", 1, 65),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "dot", 1, 65),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "dot", 1, 65),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "dot", 1, 65),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 15,
            cooldown: 4,
        },
    }
    return new GenericSkill(1556, spec.meta, multistep(spec.action))
}
