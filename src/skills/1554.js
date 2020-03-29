// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1554
/** 
Attacks the enemy 2 times with holy bullets. Each attack has a 60% chance to remove one beneficial effect and disturb the HP recovery for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "heal_block", 2, 60),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "heal_block", 2, 60),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 25,
            effect: 15,
            cooldown: 3,
        },
    }
    return new GenericSkill(1554, spec.meta, multistep(spec.action))
}
