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

// skill id: 2164
/** 
Attacks all enemies and decreases their Attack Speed for 2 turns. Also absorbs their Attack Bar by 10% with an 80% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.5),
                debuff(roll, "slow", 2, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(2164, spec.meta, multistep(spec.action))
}
