// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    debuff,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1155
/** 
Increases the Attack Power of all allies for 3 turns. Attacks all enemies 5 times and disturbs the HP recovery for 3 turns with a 30% chance each.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "heal_block", 3, 30),
                buff((self, target) => target.buf("atk", 3)),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "heal_block", 3, 30),
                buff((self, target) => target.buf("atk", 3)),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "heal_block", 3, 30),
                buff((self, target) => target.buf("atk", 3)),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "heal_block", 3, 30),
                buff((self, target) => target.buf("atk", 3)),
            ),
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 1),
                debuff(roll, "heal_block", 3, 30),
                buff((self, target) => target.buf("atk", 3)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 5,
            cooldown: 4,
        },
    }
    return new GenericSkill(1155, spec.meta, multistep(spec.action))
}
