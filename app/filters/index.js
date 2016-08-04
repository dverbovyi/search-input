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

export function getMatchPropertyFilter(prop) {
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

const SKILL_LEVEL = {
    NOVICE: 1,
    COMPETENT: 2,
    ADVANCED: 3,
    MASTER: 4,
    EXPERT: 5
}

export function getCompetenceTitleByLevel(level) {
    let title;

    switch (level) {
        case SKILL_LEVEL.NOVICE:
            title = 'Novice';
            break;
        case SKILL_LEVEL.COMPETENT:
            title = 'Competent';
            break;
        case SKILL_LEVEL.ADVANCED:
            title = 'Advanced';
            break;
        case SKILL_LEVEL.MASTER:
            title = 'Master';
            break;
        case SKILL_LEVEL.EXPERT:
            title = 'Expert';
            break;
        default:
            console.error(`Unknow competence level: ${level}`);
    }

    return title;
}