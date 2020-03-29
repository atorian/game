// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 306
/** 
Attacks an enemy to inflict damage that ignores all damage reduction effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 4.1,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(306, spec.meta, multistep(spec.action))
}
