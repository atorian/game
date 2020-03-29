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

// skill id: 1065
/** 
Attacks the enemy and freezes the target for 1 turn. Additionally, this attack will attack all other enemies, dealing half the damage of the initial attack and decreases their Attack Speed for 3 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 7.8),
                debuff(roll, "freeze", 1, 100),
                debuff(roll, "slow", 3, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 4,
        },
    }
    return new GenericSkill(1065, spec.meta, multistep(spec.action))
}
