// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    debuff,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2015
/** 
Removes harmful effects granted on all allies. In addition, when used in Druid Form, grants immunity on all allies for 2 turns and then transforms into Beast Form to Provoke all enemies for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                debuff(roll, "provoke", 1, 30),
                buff((self, target) => target.buf("immunity", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2015, spec.meta, multistep(spec.action))
}
