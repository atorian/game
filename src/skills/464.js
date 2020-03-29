// @flow
import type { Ability } from "../index"
import { step, targetAlly, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 464
/** 
Attack the enemy with an ally. This attack always lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 58
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 4),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(464, spec.meta, multistep(spec.action))
}
