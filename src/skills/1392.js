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

// skill id: 1392
/** 
Calls upon the wandering souls to attack the target 4 times. Each hit has a 30% chance to cast one random effect among increase the target's chances of landing a Glancing Hit, weaken the Attack Power or disturb recovery for 2 turns. This attack will deal more damage according to your Attack Speed. 
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
                debuff(roll, "glancing", 2, 30),
                debuff(roll, "atk_break", 2, 30),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 180)) / 230,
                ),
                debuff(roll, "glancing", 2, 30),
                debuff(roll, "atk_break", 2, 30),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 180)) / 230,
                ),
                debuff(roll, "glancing", 2, 30),
                debuff(roll, "atk_break", 2, 30),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 180)) / 230,
                ),
                debuff(roll, "glancing", 2, 30),
                debuff(roll, "atk_break", 2, 30),
                debuff(roll, "heal_block", 2, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(1392, spec.meta, multistep(spec.action))
}
