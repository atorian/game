// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1390
/** 
Attacks an enemy 3 times. Each attack has a 30% chance to decrease the enemy's Attack Speed for 2 turns. This attack will deal more damage according to your Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 180)) / 230,
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 180)) / 230,
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 180)) / 230,
                ),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1390, spec.meta, multistep(spec.action))
}
