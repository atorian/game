// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    fixedDmg,
    targetSelf,
    onKill,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2190
/** 
Attacks an enemy, inflicting the amount of HP you've lost as damage. You gain an extra turn if the enemy dies. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                fixedDmg(roll, attacker => attacker.maxHp - attacker.hp),
            ),
            step(targetSelf, onKill(additionalTurn(roll, 100))),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2190, spec.meta, multistep(spec.action))
}
