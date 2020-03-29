// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 373
/** 
Attacks the enemy with a swift attack. Increases the Attack Bar of all allies by 15% each and Attack Speed for 2 turns. Gets drunk and attacks a random enemy with [Rolling Punch] with a 50% chance afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 7.2),
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(373, spec.meta, multistep(spec.action))
}
