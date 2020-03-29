// @flow
import type { Ability } from "../index"
import {
    step,
    targetAlly,
    simpleDmg,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 602
/** 
Summons a comet to attack all enemies multiple times and casts Soul Protection on an ally with the lowest HP ratio and an ally with the lowest MAX HP for 2 turns. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Ally with lowest HP
        action: [
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                buff((self, target) => target.buf("soul_protect", 2)),
            ),
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                buff((self, target) => target.buf("soul_protect", 2)),
            ),
            step(
                targetAlly,
                simpleDmg(roll, attacker => attacker.atk * 1.2),
                buff((self, target) => target.buf("soul_protect", 2)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 5,
        },
    }
    return new GenericSkill(602, spec.meta, multistep(spec.action))
}
