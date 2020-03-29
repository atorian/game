// @flow
import type { Ability } from "../index"
import {
    step,
    targetEnemy,
    simpleDmg,
    debuff,
    strip,
    targetSelf,
    buff,
    multistep,
    GenericSkill,
} from "../skill"

// skill id: 859
/** 
Attacks all enemies 3 times with a spinning circle of fire, with each strike having a 30% chance to remove one beneficial effect and stun the enemy for 1 turn. Increases your Attack Speed for 2 turns after the attack when used with full HP. 
*/
export default function(roll: () => number): Ability {
    const spec = {
        // fixme: If used at full HP
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.4),
                debuff(roll, "stun", 1, 30),
                strip(roll, 10, 100),
            ),
            step(
                targetSelf,
                buff((self, target) => target.buf("spd", 2)),
            ),
        ],
        meta: {
            dmg: 20,
            effect: 10,
            cooldown: 4,
        },
    }
    return new GenericSkill(859, spec.meta, multistep(spec.action))
}
