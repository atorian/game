// @flow
import type { Ability } from "../index"
import { step, targetAllies, buff, multistep, GenericSkill } from "../skill"

// skill id: 687
/** 
Blows a whistle to recover 30% of the Attack Bar of allies and gives immunity effect for 2 turns. Grants 1 effect out of Increase ATK, Increase DEF, or Increase ATK SPD on allies for 1 turn afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                buff((self, target) => target.buf("immunity", 2)),
                buff((self, target) => target.buf("atk", 1)),
                buff((self, target) => target.buf("def", 1)),
                buff((self, target) => target.buf("spd", 1)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(687, spec.meta, multistep(spec.action))
}
