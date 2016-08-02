import { getMatchPropertyFilter, FILTER_NAMES } from './index';

export function positionFilter() {
    return getMatchPropertyFilter(FILTER_NAMES.POSITION);
}