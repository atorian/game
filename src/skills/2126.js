// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2126
/** 
Attacks the enemy with a cannon gun and weakens the Defense for 1 turn with a 90% chance. Afterwards, inflicts damage on all enemies and destroys their MAX HP by 50% of the inflicted damage. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4),
                debuff(roll, "def_break", 1, 90),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(2126, spec.meta, multistep(spec.action))
}
