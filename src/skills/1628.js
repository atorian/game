// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    targetSelf,
    additionalTurn,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1628
/** 
Rolls 2 dice to attack the enemy target 2 times and grants an effect according to each number you get for 2 turns as follows; 4: Unrecoverable, 5: Decrease DEF, 6: Increased chances of landing a Glancing Hit. Instantly gains another turn if you get the same number. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.9),
                debuff(roll, "heal_block", 2, null),
                debuff(roll, "def_break", 2, null),
                debuff(roll, "glancing", 2, null),
            ),
            step(targetSelf, additionalTurn(roll, 100)),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 0,
        },
    }
    return new GenericSkill(1628, spec.meta, multistep(spec.action))
}
