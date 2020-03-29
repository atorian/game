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

// skill id: 576
/** 
Attacks with the horns and provokes for 1 turn with a 50% chance. The provoke effect is guaranteed if the attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Guaranteed on Critical Hit
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "provoke", 1, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 25,
            cooldown: 0,
        },
    }
    return new GenericSkill(576, spec.meta, multistep(spec.action))
}
