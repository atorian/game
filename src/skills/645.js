// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 645
/** 
Attacks the enemy 3 times with an inferno and deals substantial damage. Each attack has a 30% chance of increasing the cooldown of the target's skills by 1 turn each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(645, spec.meta, multistep(spec.action))
}
