import { testTags } from './index';

export function skillsFilter() {
    return (skills, target) => {
        return testTags(skills, value => {
            return !!target.skills.find(skill => {
                return skill.name === value;
            });
        });
    }
}