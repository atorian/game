// @flow
import type { Ability } from "../index"
import { step, targetEnemy, simpleDmg, multistep, GenericSkill } from "../skill"

// skill id: 862
/** 
Storms an enemy with a flurry of attacks. This attack has a 100% Critical Rate against targets under inability effects. If you have full HP when using this attack, this attack will not go on cool down.  
*/
export default function(roll: () => number): Ability {
    const spec = {
        action: [
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
            ),
            step(
                targetEnemy,
                simpleDmg(roll, attacker => attacker.atk * 1.7),
            ),
        ],
        meta: {
            dmg: 15,
            effect: 0,
            cooldown: 3,
        },
    }
    return new GenericSkill(862, spec.meta, multistep(spec.action))
}
