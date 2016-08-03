export function skillsFilter() {
    return (skills, target) => {
        console.log(skills)
        let test = false;

        for (let skillName in skills) {
            if (!skills.hasOwnProperty(skillName))
                continue;

            let skillLevel = skills[skillName];

            test = !!target.skills.find(skill => {
                return skill.name === skillName && skill.level >= skillLevel;
            });

            if (!test)
                return false;
        }

        return test;
    }
}
