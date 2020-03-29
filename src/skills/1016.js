// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1016
/** 
Attacks all enemies up to 5 times, depending on your HP status. The damage also increases as the enemy's HP status decreases. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -0.5 + 1.5),
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -0.5 + 1.5),
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -0.5 + 1.5),
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -0.5 + 1.5),
                ),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -0.5 + 1.5),
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1016, spec.meta, multistep(spec.action))
}
