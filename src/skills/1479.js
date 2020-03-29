// @flow
import type { Ability } from "../index"
import { step, targetSelf, buff, multistep, GenericSkill } from "../skill"

// skill id: 1479
/** 
Increases Defense for 3 turns and gives you Immunity against harmful effects. Additionally your Attack Bar increases by 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetSelf,
                buff((self, target) => target.buf("def", 3)),
                buff((self, target) => target.buf("immunity", 3)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1479, spec.meta, multistep(spec.action))
}
