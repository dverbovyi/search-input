import { skillsFilter } from './skills';
import { locationFilter } from './location';
import { gradeFilter } from './grade';

export default function applyFilters(module) {
    module
        .filter('skills', skillsFilter)
        .filter('location', locationFilter)
        .filter('grade', gradeFilter);
}