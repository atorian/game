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

// skill id: 456
/** 
Hits the enemy with an Energy blast and inflicts Continuous Damage for 3 turns with a 20% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.8),
                debuff(roll, "dot", 3, 50),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 30,
            cooldown: 0,
        },
    }
    return new GenericSkill(456, spec.meta, multistep(spec.action))
}
