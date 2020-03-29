// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2129
/** 
Attacks the enemy with a cannon gun and destroys the target's MAX HP by 100% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8.2),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2129, spec.meta, multistep(spec.action))
}
