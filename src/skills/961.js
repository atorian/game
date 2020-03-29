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

// skill id: 961
/** 
Attacks all enemies with a hailstorm to decrease their Attack Speed for 2 turns and freezes them for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "slow", 2, 100),
                debuff(roll, "freeze", 1, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(961, spec.meta, multistep(spec.action))
}
