export function skillsFilter() {
    return (skills, target) => {
        let test = false;

        for (let value of skills) {
            test = !!target.skills.find(skill => {
                return skill.name === value; //TODO: level
            });

            if (!test)
                return false;
        }

        return test;
    }
}