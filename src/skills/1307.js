// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1307
/** 
Performs an attack that ignores all damage reduction effects. This attack is guaranteed to land as a Critical Attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 66
        action: [
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 8.4,
                ),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1307, spec.meta, multistep(spec.action))
}
