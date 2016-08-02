import { getMatchPropertyFilter, FILTER_NAMES } from './index';

export function locationFilter() {
    return getMatchPropertyFilter(FILTER_NAMES.LOCATION);
}