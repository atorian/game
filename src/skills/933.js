// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 933
/** 
Attacks without waking up the enemy that's under Sleep. Puts the target to Sleep for 1 turn with a 50% chance. Recovers the Attack Bar by 50% if the enemy falls asleep after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "sleep", 1, 50),
            ),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(933, spec.meta, multistep(spec.action))
}
