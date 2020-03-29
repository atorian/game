// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2122
/** 
Attacks the enemy 5 times. Each attack has a 50% chance to remove 1 beneficial effect and inflict Continuous Damage for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "dot", 1, 50),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "dot", 1, 50),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "dot", 1, 50),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "dot", 1, 50),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "dot", 1, 50),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2122, spec.meta, multistep(spec.action))
}
