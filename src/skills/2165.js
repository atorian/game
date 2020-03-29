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

// skill id: 2165
/** 
Attacks the enemy with the flames of punishment to remove the target's one beneficial effect with an 80% chance and inflicts Continuous Damage for 3 turns with a 100% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 5.6),
                debuff(roll, "dot", 3, 100),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 2,
        },
    }
    return new GenericSkill(2165, spec.meta, multistep(spec.action))
}
