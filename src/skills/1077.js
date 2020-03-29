// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1077
/** 
Attacks all enemies with a gust of freezing wind, dealing damage proportionate to your Defense and setting the enemies' Attack Bar to 0. Additionally, the enemies are frozen for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.def * 5),
                debuff(roll, "freeze", 1, 100),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1077, spec.meta, multistep(spec.action))
}
