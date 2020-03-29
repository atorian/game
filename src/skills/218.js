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

// skill id: 218
/** 
Attacks with a flying axe and inflicts Continuous Damage for 3 turns with a 30% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                debuff(roll, "dot", 3, 30),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 40,
            cooldown: 0,
        },
    }
    return new GenericSkill(218, spec.meta, multistep(spec.action))
}
