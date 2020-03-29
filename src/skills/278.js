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

// skill id: 278
/** 
Charges towards the enemy to inflict damage and provokes for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                debuff(roll, "provoke", 1, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(278, spec.meta, multistep(spec.action))
}
