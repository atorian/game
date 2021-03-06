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

// skill id: 2179
/** 
Thrashes the enemy, inflicting damage proportionate to your MAX HP. The attack has an 85% chance to reduce the enemy's Attack Bar by 25%. The inflicted damage increases by 100% when counterattacking. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.9 + attacker.maxHp * 0.18,
                ),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2179, spec.meta, multistep(spec.action))
}
