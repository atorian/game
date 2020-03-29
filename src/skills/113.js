// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 113
/** 
Bites your enemy continuously to inflict great damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(113, spec.meta, multistep(spec.action))
}
