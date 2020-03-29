// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1409
/** 
Rapidly fires 2 shots, and may fire an additional shot by chance. The chance of firing an additional shot is equivalent to your Critical Rate. Each attack has a 30% chance to disturb the enemy's HP recovery by 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.6),
                debuff(roll, "heal_block", 2, 30),
            ),
            step(targetSelf),
        ],
        meta: {
            dmg: 25,
            effect: 35,
            cooldown: 0,
        },
    }
    return new GenericSkill(1409, spec.meta, multistep(spec.action))
}
