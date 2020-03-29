// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1920
/** 
Attacks the enemy target 2 times and attacks all enemies with even more powerful attack on the 3rd attack. Decreases the enemy's Attack Bar by 25% every hit with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1920, spec.meta, multistep(spec.action))
}
