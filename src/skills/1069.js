// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 1069
/** 
Shoots a Light arrow at the enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.6),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1069, spec.meta, multistep(spec.action))
}
