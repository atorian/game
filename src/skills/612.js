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

// skill id: 612
/** 
Attacks an enemy 2 times with a swift charge, with each attack decreasing the Attack Speed and Defense for 2 turns.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "slow", 2, 100),
                debuff(roll, "atk_break", 2, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 2.7),
                debuff(roll, "slow", 2, 100),
                debuff(roll, "atk_break", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(612, spec.meta, multistep(spec.action))
}
