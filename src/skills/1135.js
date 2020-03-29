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

// skill id: 1135
/** 
Attacks all enemies and stuns them for 1 turn with a 75% chance. Increases your Attack Bar by 25% per stunned enemy after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Per stunned enemy
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.3),
                debuff(roll, "stun", 1, 75),
            ),
            step(targetSelf, atbIncrease(25)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1135, spec.meta, multistep(spec.action))
}
