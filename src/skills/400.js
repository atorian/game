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

// skill id: 400
/** 
Attacks all enemies at once, dealing damage proportionate to your Defense, and freezes them with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.def * 2.5 + attacker.def + 50,
                ),
                debuff(roll, "freeze", 1, 50),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(400, spec.meta, multistep(spec.action))
}
