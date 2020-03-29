// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 322
/** 
Shoots 2 precise shots that are aimed for the enemy's weak spots. Each hit has a 25% chance to ignore the enemy's Defense. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.8),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 1.8),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(322, spec.meta, multistep(spec.action))
}
