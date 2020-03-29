// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1461
/** 
Attacks all enemies 3 times to inflict damage that increases accordingly to your MAX HP. The third attack removes a beneficial effect and stuns them for 1 turn with a 25% chance each. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.07,
                ),
                debuff(roll, "stun", 1, 25),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.07,
                ),
                debuff(roll, "stun", 1, 25),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 + attacker.maxHp * 0.07,
                ),
                debuff(roll, "stun", 1, 25),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(1461, spec.meta, multistep(spec.action))
}
