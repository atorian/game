// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 293
/** 
Strikes and provokes the enemy for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "provoke", 1, 50),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 35,
            cooldown: 0,
        },
    }
    return new GenericSkill(293, spec.meta, multistep(spec.action))
}
