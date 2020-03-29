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

// skill id: 207
/** 
Attacks an enemy with a sword 2 times. Each attack has a 50% chance to decrease the target's Attack Power for 2 turns. This attack will deal more damage according to your MAX HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.maxHp * 0.12 + attacker.atk * 1,
                ),
                debuff(roll, "atk_break", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.maxHp * 0.12 + attacker.atk * 1,
                ),
                debuff(roll, "atk_break", 2, 30),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 3,
        },
    }
    return new GenericSkill(207, spec.meta, multistep(spec.action))
}
