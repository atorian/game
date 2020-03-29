// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 368
/** 
Kicks the enemy unsteadily. Gets drunk and attacks a random enemy with [Rolling Punch] with a 30% chance afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2),
            ),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(368, spec.meta, multistep(spec.action))
}
