// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1953
/** 
Attacks an enemy target 2 times and the damage dealt to the enemy with half or less HP increases by 50%. The damage that Boomerang Warrior inflicts on the target increases by 50% when they attack together. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1953, spec.meta, multistep(spec.action))
}
