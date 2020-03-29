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

// skill id: 816
/** 
Attacks the enemy and decreases the Attack Speed, Attack Power, and Defense for 2 turns. The damage dealt to enemies under harmful effects will be increased by 50%. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 8 + attacker.debuff * 0.5,
                ),
                debuff(roll, "atk_break", 2, 100),
                debuff(roll, "def_break", 2, 100),
                debuff(roll, "slow", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(816, spec.meta, multistep(spec.action))
}
