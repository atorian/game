// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2077
/** 
Attacks the enemy to remove all beneficial effects granted on the target and weakens the Defense for 3 turns. The damage increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 8.4),
                debuff(roll, "def_break", 3, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2077, spec.meta, multistep(spec.action))
}
