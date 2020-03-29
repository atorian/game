// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1421
/** 
Lays down supportive fire for allies under attack 3 times. Supportive Fire deals damage based on your Attack Power to enemies that attack your allies. [Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 0.65),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1421, spec.meta, multistep(spec.action))
}
