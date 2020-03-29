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

// skill id: 2297
/** 
Always perform an attack that has an attribute advantage on all enemies. Inflicts the number of Continuous Damage that's proportionate to the amount of damage dealt for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Element advantage behavior detected: 2297.
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4.6),
                debuff(roll, "dot", 2, null),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(2297, spec.meta, multistep(spec.action))
}
