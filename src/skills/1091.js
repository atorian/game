// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmgWithDefIgnore,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1091
/** 
The damage of this attack increases as your HP drops. If your HP is below 30%, the enemy's Defense is ignored. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If enemy is below 30% HP
        action: [
            step(
                targetEnemy,
                simpleDmgWithDefIgnore(
                    roll,
                    attacker => attacker.atk * 1 * (attacker.curHp * -2 + 7.5),
                ),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(1091, spec.meta, multistep(spec.action))
}
