// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 493
/** 
Attacks the enemy with overwhelming hatred and reduces the enemy's Attack Bar to 0. This attack always lands as a Crushing Hit regardless of the enemy's attribute. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.7),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(493, spec.meta, multistep(spec.action))
}
