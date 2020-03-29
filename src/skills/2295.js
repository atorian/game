// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2295
/** 
Consumes half of your current HP to attack the enemy target. This attack will ignore a portion of the enemy's Defense as your HP status worsens. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 5.4),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(2295, spec.meta, multistep(spec.action))
}
