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

// skill id: 236
/** 
Thrashes the enemy, inflicting damage proportionate to your MAX HP. The attack has a 50% chance to reduce the enemy's Attack Bar by 25%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1.7 + attacker.maxHp * 0.15,
                ),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 35,
            cooldown: 0,
        },
    }
    return new GenericSkill(236, spec.meta, multistep(spec.action))
}
