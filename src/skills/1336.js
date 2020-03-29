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

// skill id: 1336
/** 
Attacks the enemy three times, with each attack having a 50% chance to receive a Branding effect for 2 turns. The damage increases as the enemy's HP becomes lower. 
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
                        ((target.hp / target.maxHp) * -2.2 + 4.4),
                ),
                debuff(roll, "brand", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -2.2 + 4.4),
                ),
                debuff(roll, "brand", 2, 50),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    (attacker, target) =>
                        attacker.atk *
                        1 *
                        ((target.hp / target.maxHp) * -2.2 + 4.4),
                ),
                debuff(roll, "brand", 2, 50),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(1336, spec.meta, multistep(spec.action))
}
