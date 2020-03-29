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

// skill id: 824
/** 
Throws an uppercut punch to an enemy 2 times. Each attack has a 50% chance to stun the enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.6),
                debuff(roll, "stun", 1, 25),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 15,
            cooldown: 2,
        },
    }
    return new GenericSkill(824, spec.meta, multistep(spec.action))
}
