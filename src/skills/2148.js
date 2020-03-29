// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2148
/** 
Shoots two arrows to attack a target enemy and a random enemy and removes a beneficial effect granted on them with an 80% chance each. Guarantees to stun the enemy if both arrows hit the same target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If both arrows hit same target
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "stun", 1, null),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "stun", 1, null),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 20,
            cooldown: 2,
        },
    }
    return new GenericSkill(2148, spec.meta, multistep(spec.action))
}
