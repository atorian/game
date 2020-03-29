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

// skill id: 731
/** 
Drops a flaming bomb to randomly attack the enemies 4 times. Each attack will inflict Continuous Damage for 2 turns. Immediately sets off the bomb if the enemy has bombs. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "dot", 2, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "dot", 2, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "dot", 2, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "dot", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(731, spec.meta, multistep(spec.action))
}
