import * as transform from './transform';

const sfSkills = require(process.cwd() + '/data/skills.json');
const sfUnits = require(process.cwd() + '/data/units.json');

const UsedSkills = new Set();
Object.values(sfUnits).forEach(u => {
    if (u.skills && u.skills.length) {
        u.skills.forEach(id => UsedSkills.add(id));
    }
});

const swSkillsArr = Object.values(sfSkills);
const parsed = {};
for (const skill of swSkillsArr) {
    if (UsedSkills.has(skill.id)) {
        try {
            if (!parsed[skill.id]) {
                parsed[skill.id] = transform.skill(skill);
            } else {
                console.error('duplicate skill');
            }
        } catch (e) {
            console.error(e);
        }
    }
}

console.log(JSON.stringify(parsed, null, 2));
