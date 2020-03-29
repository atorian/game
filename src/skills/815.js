// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    strip,
    cleanse,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 815
/** 
Inflicts damage to all enemies and removes beneficial effects on all enemies. Removes 1 harmful effect of allies afterwards. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 4.2),
                strip(roll, 10, 100),
                cleanse(1),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(815, spec.meta, multistep(spec.action))
}
