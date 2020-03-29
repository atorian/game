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

// skill id: 1940
/** 
Attacks and stuns the enemy for 1 turn with a 15% chance. Decreases the Attack Bar by 30% with a 100% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 15),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1940, spec.meta, multistep(spec.action))
}
