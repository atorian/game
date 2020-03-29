// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    buff,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1290
/** 
Increases the Attack Speed for 2 turns with quick footwork. Attacks the enemy to inflict damage proportionate to your Attack Speed. The Attack Bar will be increased by 50% after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker =>
                        (attacker.atk * 1 * (attacker.atkSpd + 400)) / 80,
                ),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 2)),
                atbIncrease(50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1290, spec.meta, multistep(spec.action))
}
