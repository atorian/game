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

// skill id: 481
/** 
Throws a ball in flames to attack all enemies 2 times and inflicts continuous damage for 2 turns with each attack. Inflicts continuous damage for 3 turns if you get a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: On non-crit hit
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.9 + attacker.atk + 120,
                ),
                debuff(roll, "dot", 2, 100),
                debuff(roll, "dot", 100, null),
            ),
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.9 + attacker.atk + 120,
                ),
                debuff(roll, "dot", 2, 100),
                debuff(roll, "dot", 100, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(481, spec.meta, multistep(spec.action))
}
