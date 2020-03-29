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

// skill id: 546
/** 
Attacks the enemy with a magical arrow which casts various harmful effects according to the attribute relation between you and the enemy. The damage of this effect increases by 15% for each harmful effect on the enemy. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: No Elemental Advantage
        // fixme: Elemental Disadvantage
        // fixme: Elemental Advantage
        action: [
            step(
                targetEnemy,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 3.7 + attacker.debuff * 0.15,
                ),
                debuff(roll, "atk_break", 2, 100),
                debuff(roll, "sleep", 1, 100),
                debuff(roll, "def_break", 2, 100),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(546, spec.meta, multistep(spec.action))
}
