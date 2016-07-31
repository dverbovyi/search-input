import { testTags } from './index';

export function gradeFilter() {
    return (grades, target) => {
        return testTags(grades, value => {
            return target.grade.toUpperCase() === value.toUpperCase();
        });
    }
}