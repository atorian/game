// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    debuff,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2013
/** 
Revives a dead ally target with 30% HP. If the ally target is alive, casts Soul Protection for 3 turns. In addition, when used in Druid Form, increases the Defense of all allies for 3 turns and then transforms into Beast Form to Provoke all enemies for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAlly,
                debuff(roll, "provoke", 1, 30),
                buff((self, target) => target.buf("soul_protect", 3)),
                buff((self, target) => target.buf("def", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 6,
        },
    }
    return new GenericSkill(2013, spec.meta, multistep(spec.action))
}
