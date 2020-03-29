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

// skill id: 1067
/** 
Stuns all enemies with an 80% chance, increases the Attack Speed of all allies for 2 turns and increases the Attack Bar of all allies by 25%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                debuff(roll, "stun", 1, 80),
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(1067, spec.meta, multistep(spec.action))
}
