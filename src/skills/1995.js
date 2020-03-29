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

// skill id: 1995
/** 
Attacks an enemy and stuns the target for 1 turn with a 35% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "stun", 1, 35),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 15,
            cooldown: 0,
        },
    }
    return new GenericSkill(1995, spec.meta, multistep(spec.action))
}
