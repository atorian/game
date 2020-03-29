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

// skill id: 1942
/** 
Attacks and Stuns the enemy for 1 turn with an 85% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 85),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1942, spec.meta, multistep(spec.action))
}
