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

// skill id: 1235
/** 
Attacks with a sword. [Soul Reaper] is automatically activated if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Soul Reaper Only
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 4.1 + attacker.atk + 180,
                ),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1235, spec.meta, multistep(spec.action))
}
