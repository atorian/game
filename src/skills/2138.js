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

// skill id: 2138
/** 
Attacks the enemy 3 times. Each attack weakens the enemy's Attack Power, decreases the enemy's Attack Speed and blocks beneficial effects for 2 turns with a 75% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
                debuff(roll, "atk_break", 2, 75),
                debuff(roll, "slow", 2, 75),
                debuff(roll, "blockBuff", 2, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
                debuff(roll, "atk_break", 2, 75),
                debuff(roll, "slow", 2, 75),
                debuff(roll, "blockBuff", 2, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
                debuff(roll, "atk_break", 2, 75),
                debuff(roll, "slow", 2, 75),
                debuff(roll, "blockBuff", 2, 75),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(2138, spec.meta, multistep(spec.action))
}
