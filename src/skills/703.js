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

// skill id: 703
/** 
Attacks the enemy 2 times and weakens the Attack Power and the Defense for 2 turns with a 75% chance with each attack. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.14,
                ),
                debuff(roll, "atk_break", 2, 75),
                debuff(roll, "def_break", 2, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.14,
                ),
                debuff(roll, "atk_break", 2, 75),
                debuff(roll, "def_break", 2, 75),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(703, spec.meta, multistep(spec.action))
}
