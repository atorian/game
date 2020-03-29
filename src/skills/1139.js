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

// skill id: 1139
/** 
Attacks all enemies with a giant net and puts them to sleep for 1 turn and decreases the Attack Speed for 2 turns with an 80% chance each. The damage of this skill will increase according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 2.7 + attacker.maxHp * 0.18,
                ),
                debuff(roll, "sleep", 1, 80),
                debuff(roll, "slow", 2, 80),
            ),
        ],
        meta: {
            dmg: 10,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(1139, spec.meta, multistep(spec.action))
}
