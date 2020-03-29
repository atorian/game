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

// skill id: 1362
/** 
Attacks all enemies 3 times to decrease the Defense, increase their chances of landing a glancing hit and disturb their HP recovery for 2 turns with a 50% chance. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "glancing", 2, 50),
                debuff(roll, "heal_block", 2, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "glancing", 2, 50),
                debuff(roll, "heal_block", 2, 50),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "def_break", 2, 50),
                debuff(roll, "glancing", 2, 50),
                debuff(roll, "heal_block", 2, 50),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 30,
            cooldown: 4,
        },
    }
    return new GenericSkill(1362, spec.meta, multistep(spec.action))
}
