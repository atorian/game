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

// skill id: 1225
/** 
Attacks all enemies with mighty waves, Silencing them for 2 turns. The enemies under the Silence Effect won't be able to use skills with cooldown time excluding the passive skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "silence", 2, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "silence", 2, 100),
            ),
        ],
        meta: {
            dmg: 0,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1225, spec.meta, multistep(spec.action))
}
