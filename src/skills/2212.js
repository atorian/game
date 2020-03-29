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

// skill id: 2212
/** 
Attacks the enemy with razor-sharp claws and decreases the Defense for 2 turns with an 80% chance and inflicts Continuous Damage for 3 turns with an 80% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 4.5),
                debuff(roll, "def_break", 2, 80),
                debuff(roll, "dot", 3, 80),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 0,
        },
    }
    return new GenericSkill(2212, spec.meta, multistep(spec.action))
}
