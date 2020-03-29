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

// skill id: 626
/** 
Attacks the enemy 3 times with energy balls. Each attack has a 30% chance to decrease the target's Attack Bar by 30%. The damage increases accordingly to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.8 + attacker.maxHp * 0.08,
                ),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.8 + attacker.maxHp * 0.08,
                ),
                atbDecrease(roll, undefined),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.8 + attacker.maxHp * 0.08,
                ),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(626, spec.meta, multistep(spec.action))
}
