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

// skill id: 212
/** 
Increases your Defense for 3 turns and provokes all enemies with an 80% chance.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(targetEnemies, debuff(roll, "provoke", 1, 80)),
            step(
                targetSelf,
                buff((self, target) => target.buf("def", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(212, spec.meta, multistep(spec.action))
}
