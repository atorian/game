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

// skill id: 1655
/** 
Attacks the enemy 2 times to disturb the HP recovery for 2 turns with a 30% chance each. The damage also increases according to your Attack Speed. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 120)) / 110,
                ),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 120)) / 110,
                ),
                debuff(roll, "heal_block", 2, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1655, spec.meta, multistep(spec.action))
}
