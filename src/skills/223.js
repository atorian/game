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

// skill id: 223
/** 
Attacks an enemy and decreases the enemy's Defense for 2 turns. The damage increases accordingly to your current HP situation. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 1 * (attacker.curHp * 3.5 + 4),
                ),
                debuff(roll, "def_break", 2, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(223, spec.meta, multistep(spec.action))
}
