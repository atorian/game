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

// skill id: 761
/** 
Randomly attacks the enemies several times and weakens the Defense for 2 turns with a 35% chance with each attack and exchanges the decrease attack speed effect with the stun effect for 1 turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If target has Decrease SPD
        action: [
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "def_break", 2, 35),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "def_break", 2, 35),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "def_break", 2, 35),
                debuff(roll, "stun", 1, null),
            ),
            step(
                targetEnemies,
                simpleDmg(roll, attacker => attacker.atk * 3),
                debuff(roll, "def_break", 2, 35),
                debuff(roll, "stun", 1, null),
            ),
        ],
        meta: {
            dmg: 30,
            effect: 0,
            cooldown: 2,
        },
    }
    return new GenericSkill(761, spec.meta, multistep(spec.action))
}
