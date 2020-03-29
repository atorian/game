// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 2168
/** 
Attacks the enemy to inflict damage. In addition, blows up the Continuous Damage granted on the target to inflict damage that's equivalent to its Continuous Damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 74
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.1),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2168, spec.meta, multistep(spec.action))
}
