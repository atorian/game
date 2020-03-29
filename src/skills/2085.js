// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2085
/** 
Attacks the enemy and steals one beneficial effect with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 50,
            cooldown: 0,
        },
    }
    return new GenericSkill(2085, spec.meta, multistep(spec.action))
}
