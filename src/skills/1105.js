// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    targetSelf,
    atbIncrease,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1105
/** 
Attacks all enemies 2 times with a sharp wind and weakens the Defense for 2 turns with a 50% chance for each attack. Your Attack Bar will increase by 10% each when the attack lands as a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "def_break", 2, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1.5),
                debuff(roll, "def_break", 2, 50),
            ),
            step(targetSelf, atbIncrease(10)),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 2,
        },
    }
    return new GenericSkill(1105, spec.meta, multistep(spec.action))
}
