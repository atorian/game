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

// skill id: 635
/** 
Performs an unpredictable attack and decreases the target's Attack Power for 1 turn. This attack will also increase the target's chance of landing a Glancing Hit for 1 turn if this attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3.7),
                debuff(roll, "glancing", 1, 100),
                debuff(roll, "atk_break", 1, null),
            ),
        ],
        meta: {
            dmg: 35,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(635, spec.meta, multistep(spec.action))
}
