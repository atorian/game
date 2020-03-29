// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmgWithDefIgnore,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 721
/** 
Throws a number of cards and inflicts damage to all enemies, ignoring their Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 0.68),
            ),
            step(
                targetEnemies,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 0.68),
            ),
            step(
                targetEnemies,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 0.68),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(721, spec.meta, multistep(spec.action))
}
