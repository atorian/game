// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 787
/** 
Bursts a mana bubble that deals damage to an enemy and removes a beneficial effect with a 50% chance. The damage of this skill increases according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.5 + attacker.maxHp * 0.12,
                ),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(787, spec.meta, multistep(spec.action))
}
