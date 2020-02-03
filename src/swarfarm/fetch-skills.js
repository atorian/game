const got = require('got');
const fs = require('fs');

const viewData = {
    extract(unit) {
        this[unit.com2us_id] = {
            name: unit.name,
            icon: `skills/${unit.image_filename}`,
        }
    }
};

const unitStats = {
    extract(unit) {
        this[unit.com2us_id] = {
            hp: unit.max_lvl_hp,
            atk: unit.max_lvl_attack,
            def: unit.max_lvl_defense,
            spd: unit.speed,
            cr: unit.crit_rate,
            cd: unit.crit_damage,
            acc: unit.accuracy,
            res: unit.resistance,
            skills: unit.skills
        }
    }
};

async function fetch(url) {
    let currentUrl = url;
    const data = {};
    do {
        console.error(currentUrl);
        let response = await got.get(currentUrl).json();
        currentUrl = response.next;
        response.results.forEach(el => data[el.id] = el);
    } while (currentUrl);

    return data;
}

fetch('https://swarfarm.com/api/v2/skills/')
    .then(JSON.stringify)
    .then(console.log)
    .catch(console.error);
