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

// skill id: 1078
/** 
Attacks the enemy to inflict damage proportionate to the target's MAX HP and attacks all enemies once again with 20% of the damage. Additionally, this attack has a 40% chance to decrease the enemy's Attack Power for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 3.75 + target.maxHp * 0.15,
                ),
                debuff(roll, "atk_break", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk * 3.75 + target.maxHp * 0.15,
                ),
                debuff(roll, "atk_break", 2, 40),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(1078, spec.meta, multistep(spec.action))
}
