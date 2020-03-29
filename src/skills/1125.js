// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1125
/** 
Removes a harmful effect, except inability effects, on all allies each turn and the allies will recover their HP by 3% for each harmful effect removed. 
[Automatic Effect] 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: passive skill
        // fixme: Does not cleanse inability effects (Stun, Freeze, etc)
        // fixme: On cleanse, per harmful effect removed
        action: [
            step(
                targetAllies,
                heal((self, target) => self.maxHp * undefined),
                cleanse(1),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1125, spec.meta, multistep(spec.action))
}
