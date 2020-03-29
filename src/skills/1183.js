// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1183
/** 
Removes the beneficial effects of all enemies with holy fire, weakens the Defense if you successfully remove the beneficial effects for 1 turn, and inflicts damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If buff was removed
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "def_break", 1, null),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1183, spec.meta, multistep(spec.action))
}
