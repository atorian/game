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

// skill id: 1233
/** 
Attacks with a sword. [Seal of Fire] is automatically activated if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Seal of Fire only
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
    return new GenericSkill(1233, spec.meta, multistep(spec.action))
}
