// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 818
/** 
Attacks an enemy and guarantees to stun the target if the attack lands as a Critical Hit. The attack will be landed as a Critical Hit with a 100% chance if the target is asleep. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(818, spec.meta, multistep(spec.action))
}
