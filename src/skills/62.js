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

// skill id: 62
/** 
Shoots two arrows to attack a target enemy and a random enemy. Guarantees to stun the enemy if both arrows hit the same target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If both arrows hit same target
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.4),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(62, spec.meta, multistep(spec.action))
}
