// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2011
/** 
Recovers HP of all allies by 30%. In addition, when used in Druid Form, increases the Attack Bar of all allies by 15% and then transforms into Beast Form to Provoke all enemies for 1 turn with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                debuff(roll, "provoke", 1, 30),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
            recovery: 30,
        },
    }
    return new GenericSkill(2011, spec.meta, multistep(spec.action))
}
