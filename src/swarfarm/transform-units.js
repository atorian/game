const data = require('../../data/units');

console.log(`
import { DARK, FIRE, LIGHT, WATER, WIND } from "./index";

module.exports = {
`);

Object.values(data).map(u => console.log(`
    ${u.id}: {
        id: ${u.id},
        name: "${u.name}",
        icon: "https://swarfarm.com/static/herders/images/monsters/${u.image_filename}",
        element: ${u.element.toUpperCase()},
        hp: ${u.max_lvl_hp},
        atk: ${u.max_lvl_attack},
        def: ${u.max_lvl_defense},
        spd: ${u.speed},
        cr: ${u.crit_rate},
        cd: ${u.crit_damage},
        res: ${u.resistance},
        acc: ${u.accuracy},
        skills: [${u.skills.join(', ')}],
    },
`));

console.log(
`
};
`);
