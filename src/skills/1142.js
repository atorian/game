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

// skill id: 1142
/** 
Summons a teddy bear to attack the enemy. This attack has a 25% chance to forcibly put the enemy to sleep for 1 turn. Acquires another turn if the enemy falls asleep. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "sleep", 1, 25),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 5,
            cooldown: 0,
        },
    }
    return new GenericSkill(1142, spec.meta, multistep(spec.action))
}
