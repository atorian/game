// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    buff,
    targetSelf,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 676
/** 
Becomes possessed with unstoppable rage and attacks all enemies. Increases the Attack Power and Attack Speed of all allies for 2 turns. When this attack is on cooldown, your Attack Speed will increase and you'll recover 10% HP every turn. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: Unknown effect: 45
        // fixme: When on cooldown
        // fixme: When on cooldown
        action: [
            step(
                targetAllies,
                simpleDmg(roll, attacker => attacker.atk * 2.1),
                buff((self, target) => target.buf("atk", 2)),
                buff((self, target) => target.buf("spd", 2)),
                buff((self, target) => target.buf("spd", null)),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", null)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(676, spec.meta, multistep(spec.action))
}
