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

// skill id: 2328
/** 
Attacks an enemy 3 times. Each attack has a 45% chance to decrease the enemy's Defense for 3 turns. The damage of this attack increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.6 + attacker.maxHp * 0.12,
                ),
                debuff(roll, "def_break", 3, 45),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.6 + attacker.maxHp * 0.12,
                ),
                debuff(roll, "def_break", 3, 45),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.6 + attacker.maxHp * 0.12,
                ),
                debuff(roll, "def_break", 3, 45),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(2328, spec.meta, multistep(spec.action))
}
