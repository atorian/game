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

// skill id: 958
/** 
Attacks all enemies 3 times with a cyclone. Each strike has a 40% chance of increasing the chances of the enemy to land a Glancing Hit for 2 turns. The damage increases according to the Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 30)) / 150,
                ),
                debuff(roll, "glancing", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 30)) / 150,
                ),
                debuff(roll, "glancing", 2, 40),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 30)) / 150,
                ),
                debuff(roll, "glancing", 2, 40),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(958, spec.meta, multistep(spec.action))
}
