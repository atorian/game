// @flow
import type { Ability } from "../index"
import {
    step,
    targetAllies,
    simpleDmg,
    buff,
    strip,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 1154
/** 
Attacks all enemies 3 times to inflict damage that increases accordingly to your MAX HP. Each attack has a 50% chance to remove 1 beneficial effect. Afterwards, increases the Defense of all allies for 3 turns additionally. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.75 + attacker.maxHp * 0.05,
                ),
                buff((self, target) => target.buf("def", 3)),
                strip(roll, 10, 100),
            ),
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.75 + attacker.maxHp * 0.05,
                ),
                buff((self, target) => target.buf("def", 3)),
                strip(roll, 10, 100),
            ),
            step(
                targetAllies,
                simpleDmg(
                    roll,
                    attacker => attacker.atk * 0.75 + attacker.maxHp * 0.05,
                ),
                buff((self, target) => target.buf("def", 3)),
                strip(roll, 10, 100),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(1154, spec.meta, multistep(spec.action))
}
