import { testTags } from './index';

export function gradeFilter() {
    return (grades, target) => {
        return !!(grades.indexOf(target.grade) + 1);
    }
}