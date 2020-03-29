// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1612
/** 
Attacks the enemy target to inflict damage. The damage increases by 20% for each harmful effect on the enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1612, spec.meta, multistep(spec.action))
}
