// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1975
/** 
Attacks the enemy 3 times with a whirling storm of light. Each attack has a 20% chance to weaken the Attack Power for 2 turns and decrease the Attack Bar by 10%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "atk_break", 2, 20),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "atk_break", 2, 20),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                debuff(roll, "atk_break", 2, 20),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 40,
            cooldown: 0,
        },
    }
    return new GenericSkill(1975, spec.meta, multistep(spec.action))
}
