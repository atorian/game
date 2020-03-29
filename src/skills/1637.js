// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    debuff,
    buff,
    atbDecrease,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1637
/** 
Makes the Attack Bar of all enemies and all allies change to 0, increases the Attack Speed of all other allies except yourself for 1 turn and stuns yourself for 1 turn. This effect can't be resisted and ignores the immunity. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                debuff(roll, "stun", 1, 100),
                buff((self, target) => target.buf("spd", 2)),
                atbDecrease(roll, undefined),
            ),
            step(targetSelf, debuff(roll, "stun", 1, 100)),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(1637, spec.meta, multistep(spec.action))
}
