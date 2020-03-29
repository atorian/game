// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1151
/** 
Attacks all enemies 3 times. Each attack will decrease their Attack Speed and inflict Continuous Damage for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "slow", 3, 100),
                debuff(roll, "dot", 3, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "slow", 3, 100),
                debuff(roll, "dot", 3, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
                debuff(roll, "slow", 3, 100),
                debuff(roll, "dot", 3, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1151, spec.meta, multistep(spec.action))
}
