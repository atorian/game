// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1161
/** 
Attacks all enemies with an 80% chance to remove beneficial effects, inflicting Continuous Damage equal to the number of removed beneficial effects for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Number of Continuous Damage is equal to number of buffs removed
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "dot", 2, null),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 10,
            cooldown: 3,
        },
    }
    return new GenericSkill(1161, spec.meta, multistep(spec.action))
}
