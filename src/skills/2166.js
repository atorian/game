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

// skill id: 2166
/** 
Attacks all enemies to decrease their Attack Speed for 2 turns. Also increases their skill cooldown time by 1 turn each with an 80% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
                debuff(roll, "slow", 2, 80),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(2166, spec.meta, multistep(spec.action))
}
