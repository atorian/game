// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithoutDmgReduction,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2099
/** 
Attacks the enemy to inflict damage that ignores all damage reduction effects. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithoutDmgReduction(
                    roll,
                    attacker => attacker.atk * 3.8,
                ),
            ),
        ],
        meta: {
            dmg: 45,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(2099, spec.meta, multistep(spec.action))
}
