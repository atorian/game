// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 679
/** 
Bounces towards the enemy to attack and gets another turn with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(679, spec.meta, multistep(spec.action))
}
