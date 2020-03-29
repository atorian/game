// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemies,
    simpleDmg,
    debuff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1541
/** 
Attacks all enemies 2 times with flaming sword energy. Each attack has a 40% chance to decrease the enemies' Defense for 2 turns. This skill has a 70% chance to activate the Sword of the Supreme Sky Wolf, and the activation chance increases by 30% additionally when you land a Critical Hit. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "atk_break", 2, 40),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                debuff(roll, "atk_break", 2, 40),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 20,
            cooldown: 4,
        },
    }
    return new GenericSkill(1541, spec.meta, multistep(spec.action))
}
