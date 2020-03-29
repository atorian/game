// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 252
/** 
Creates a shield that's 50% of your MAX HP for 3 turns and recovers 15% of HP at every turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("hot", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            shield: 0.2,
        },
    }
    return new GenericSkill(252, spec.meta, multistep(spec.action))
}
