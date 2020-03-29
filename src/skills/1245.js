// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1245
/** 
Attacks the enemy target to inflict damage and randomly attacks the enemies 2 times. The enemy's Defense is ignored when used in invincible state. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If invincible when using skill
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 2.8),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 2.8),
            ),
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(roll, attacker => attacker.atk * 2.8),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1245, spec.meta, multistep(spec.action))
}
