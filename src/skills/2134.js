// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 2134
/** 
Attacks all enemies 3 times to inflict damage that increases accordingly to your MAX HP. The first attack removes 2 beneficial effects, the second attack decreases the Attack Bar by 15%, and the third attack stuns them for 1 turn with 25% chance each. 
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
            ),
        ],
        meta: {
            dmg: 20,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(2134, spec.meta, multistep(spec.action))
}
