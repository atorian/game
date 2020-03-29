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

// skill id: 1938
/** 
Attacks and stuns the enemy for 1 turn with a 35% chance. Your attacks won't land as Glancing Hits. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "stun", 1, 15),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1938, spec.meta, multistep(spec.action))
}
