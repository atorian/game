// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1928
/** 
Attacks the enemy 2 times to remove the beneficial effect with a 75% chance each and provokes the enemy for 1 turn. Afterwards, counterattacks whenever you're attacked for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "provoke", 1, 100),
                strip(roll, 10, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 2)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(1928, spec.meta, multistep(spec.action))
}
