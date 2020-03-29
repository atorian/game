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

// skill id: 1076
/** 
Attacks all enemies with a storm of ice, dealing damage proportionate to your Defense and freezing them for 1 turn with a 60% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.def * 3.6),
                debuff(roll, "freeze", 1, 60),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(1076, spec.meta, multistep(spec.action))
}
