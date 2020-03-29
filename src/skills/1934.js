// @flow
import type { Ability } from "../index"
import { step, targetAllies, multistep, GenericSkill } from "../skill"

// skill id: 1934
/** 
Creates a shield that's proportionate to 20% of your HP on all allies for 2 turns and activates Threat state while the enemy attacks 3 times. The enemy can only attack the target under the Threat state when using the attack skill. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 64
        action: [step(targetAllies)],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1934, spec.meta, multistep(spec.action))
}
