import { testTags } from './index';

export function locationFilter() {
    return (locations, target) => {
        return !!(locations.indexOf(target.location) + 1);
    }
}