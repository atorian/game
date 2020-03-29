// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 624
/** 
Strikes the enemy with a strong sound wave, removing a beneficial effect with a 75% chance and attacks consecutively with a 30% chance. The damage of this attack is proportionate to your MAX HP. 
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
                strip(roll, 10, 100),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(624, spec.meta, multistep(spec.action))
}
