import { testTags } from './index';

export function locationFilter() {
    return (locations, target) => {
        return testTags(locations, value => {
            return target.location.toUpperCase() === value.toUpperCase();
        });
    }
}