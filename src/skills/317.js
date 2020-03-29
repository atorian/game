// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 317
/** 
Attacks the enemy with an arrow that can't be removed and removes all beneficial effects granted on the enemy, weakens Defense for 2 turns and increases the chances of landing a glancing hit for 2 turns with a 90% chance each. In addition, increases your Attack Bar by 50% if you attack with a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.1),
                debuff(roll, "def_break", 2, 10),
                debuff(roll, "glancing", 2, 100),
                strip(roll, 10, 100),
            ),
            step(targetSelf, atbIncrease(50)),
        ],
        meta: {
            dmg: 30,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(317, spec.meta, multistep(spec.action))
}
