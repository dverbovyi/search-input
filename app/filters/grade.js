import { getMatchPropertyFilter, FILTER_NAMES } from './index';

export function gradeFilter() {
    return getMatchPropertyFilter(FILTER_NAMES.GRADE);
}