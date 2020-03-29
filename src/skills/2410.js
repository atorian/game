// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2410
/** 
The faster your Attack Speed, the greater the damage becomes. Attacks the enemy with the beast 2 times. The beast's attack changes all beneficial effects granted on the target to Continuous Damage for 1 turn, and the rider's attack inflicts damage that increases by 15% for each harmful effect granted on the target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 1 per buff removed
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 120)) / 100,
                ),
                debuff(roll, "dot", 1, 100),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 120)) / 100,
                ),
                debuff(roll, "dot", 1, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2410, spec.meta, multistep(spec.action))
}
