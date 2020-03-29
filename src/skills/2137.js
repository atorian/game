// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 2137
/** 
Makes the Blood Contract with all allies to grant the Vampire effect that heals their HP by 20% of the inflicted damage for 3 turns and increases their Attack Power for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 73
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("atk", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2137, spec.meta, multistep(spec.action))
}
