// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 874
/** 
Fires a carefully aimed shot that deals great damage. This attack sets off the bomb effects on the target. Instantly gains another turn if you set off the bomb. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If bomb detonated
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 8),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(874, spec.meta, multistep(spec.action))
}
