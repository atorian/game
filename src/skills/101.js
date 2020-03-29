// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    atbDecrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 101
/** 
Summons a powerful whirlpool, inflicting damage on all enemies, and reducing their Attack Bars by 40%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 4),
                atbDecrease(roll, undefined),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(101, spec.meta, multistep(spec.action))
}
