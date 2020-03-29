// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    heal,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 371
/** 
Recovers the HP of all allies proportionate to your Attack Power and decreases their chances of being attacked with a critical hit for 2 turns. Gets drunk and attacks a random enemy with [Rolling Punch] with a 30% chance afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                heal((self, target) => self.atk * 2.4),
                buff((self, target) => target.buf("anti_cr", 2)),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 3,
            recovery: 30,
        },
    }
    return new GenericSkill(371, spec.meta, multistep(spec.action))
}
