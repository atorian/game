// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1301
/** 
Attacks an enemy and inflicts Continuous Damage for 2 turns. This attack will also decrease the enemy's Defense for 2 turns if it lands as a Critical Hit. Instantly gains another turn if the target's HP is less than 50% after the attack. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If target HP less than 50% after attack
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.6),
                debuff(roll, "dot", 2, 100),
                debuff(roll, "def_break", 2, null),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(1301, spec.meta, multistep(spec.action))
}
