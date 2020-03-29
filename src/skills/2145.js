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

// skill id: 2145
/** 
Shoots two arrows to attack a target enemy and a random enemy and stuns them with a 50% chance each. Guarantees to stun the enemy if both arrows hit the same target. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: 100% if both hits on same target
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "stun", 1, 60),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                debuff(roll, "stun", 1, 60),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 10,
            cooldown: 2,
        },
    }
    return new GenericSkill(2145, spec.meta, multistep(spec.action))
}
