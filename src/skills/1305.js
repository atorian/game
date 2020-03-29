// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    atbDecrease,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1305
/** 
Attacks the enemy 2 times and decreases the Attack Speed for 3 turns. Each hit will also decrease the enemy's Attack Bar by 50%. If the enemy's Attack Bar gets depleted by this attack, you instantly recover your turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If enemy attack bar at 0
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "slow", 3, 100),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.9),
                debuff(roll, "slow", 3, 100),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1305, spec.meta, multistep(spec.action))
}
