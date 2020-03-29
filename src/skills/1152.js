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

// skill id: 1152
/** 
Attacks all enemies 3 times. Each attack has a 40% chance to decrease the target's Defense for 3 turns and attack speed for 2 turns. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.75 + attacker.maxHp * 0.05,
                ),
                debuff(roll, "def_break", 3, 40),
                debuff(roll, "slow", 3, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.75 + attacker.maxHp * 0.05,
                ),
                debuff(roll, "def_break", 3, 40),
                debuff(roll, "slow", 3, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.75 + attacker.maxHp * 0.05,
                ),
                debuff(roll, "def_break", 3, 40),
                debuff(roll, "slow", 3, 40),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(1152, spec.meta, multistep(spec.action))
}
