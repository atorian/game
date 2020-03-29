// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1560
/** 
Attacks the enemy with a forbidden bullet and inflicts damage that ignores all damage reduction effects. Increases your critical damage by 50% when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 4,
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1560, spec.meta, multistep(spec.action))
}
