// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1632
/** 
Rolls 2 dice to attack all enemies and Stuns them for 1 turn if the sum of the numbers is greater than 7, and decreases the Attack Speed for 2 turns if the sum is less than 7. Instantly gains another turn if you get the same number. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "stun", 1, null),
                debuff(roll, "slow", 2, null),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1632, spec.meta, multistep(spec.action))
}
