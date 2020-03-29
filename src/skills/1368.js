// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1368
/** 
Attacks an enemy, stealing all beneficial effects and sets all of the enemy's skills on max cooldown time. Decreases the cooldown time of the [Charming Voice] skill by the number of beneficial effects stolen from the enemy. If the skill didn't set the enemy's skills on max cooldown time, the cooldown time of the [Charming Voice] will reset. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: By number of buffs stolen
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.2),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1368, spec.meta, multistep(spec.action))
}
