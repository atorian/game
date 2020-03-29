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

// skill id: 776
/** 
Attacks the target that isn't granted with any beneficial effects with 3 magic bullets and Silences the target for 2 turns with a 75% chance each. The target under the Silence Effect won't be able to use skills with cooldown time excluding the passive skills. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "silence", 2, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "silence", 2, 75),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "silence", 2, 75),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 25,
            cooldown: 3,
        },
    }
    return new GenericSkill(776, spec.meta, multistep(spec.action))
}
