// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 520
/** 
Swings the hammer, attacking all enemies and decreasing their Defense for 2 turns with a 50% chance. The damage increases according to your Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.def * 3),
                debuff(roll, "def_break", 2, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(520, spec.meta, multistep(spec.action))
}
