// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    debuff,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2189
/** 
Provokes all enemies with a 70% chance, and counterattacks every time you receive damage for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemies, debuff(roll, "provoke", 1, 70)),
            step(
                targetSelf,
                buff((self, target) => target.buf("counterAtk", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 30,
            cooldown: 3,
        },
    }
    return new GenericSkill(2189, spec.meta, multistep(spec.action))
}
