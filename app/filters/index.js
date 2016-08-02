import { skillsFilter } from './skills';
import { locationFilter } from './location';
import { gradeFilter } from './grade';
import { positionFilter } from './position';

export default function applyFilters(module) {
    module
        .filter('skills', skillsFilter)
        .filter('location', locationFilter)
        .filter('grade', gradeFilter)
        .filter('position', positionFilter);
}

export function getMatchPropertyFilter(prop){
    return (tags, target) => {
        return !!(tags.indexOf(target[prop]) + 1);
    }
}

export const FILTER_NAMES = {
    LOCATION: 'location',
    SKILLS: 'skills',
    GRADE: 'grade',
    POSITION: 'position'
}