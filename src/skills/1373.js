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

// skill id: 1373
/** 
Attacks the enemy 2 times and deals damage proportionate to your Defense. Each attack has a 25% chance to stun the enemy for 1 turn. If the target is not suffering any harmful effects, 1 additional attack is added. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.8),
                debuff(roll, "stun", 1, 25),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.8),
                debuff(roll, "stun", 1, 25),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.def * 1.8),
                debuff(roll, "stun", 1, 25),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 20,
            cooldown: 0,
        },
    }
    return new GenericSkill(1373, spec.meta, multistep(spec.action))
}
