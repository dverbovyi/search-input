import { FILTER_NAMES } from './filters';

export default class TagStorage {
    constructor(){
        this.table = {};
    }

    get records(){
        return this.table;
    }

    add(tag){
        this.execute('add', tag);
    }

    remove(tag){
        this.execute('remove', tag);
    }

    execute(command, tag){
        let storage = null;

        switch (tag.name) {
            case FILTER_NAMES.SKILLS:
                ObjectStorage[command].call(this, tag, 1);
                break;
            default:
                ArrayStorage[command].call(this, tag);
                break;
        }
    }

    isEmpty(){
        return !!Object.keys(this.records).length;
    }
}

class ObjectStorage{
    static add(tag, defaultValue){
        this.records[tag.name] = this.records[tag.name] || {};
        this.records[tag.name][tag.value] = defaultValue;
    }

    static remove(tag){
        let record = this.records[tag.name];
        delete record[tag.value];

        if(!Object.keys(record).length)
            delete this.records[tag.name];
    }
}

class ArrayStorage {
    static add(tag){
        this.records[tag.name] = this.records[tag.name] || [];
        this.records[tag.name].push(tag.value);
    }

    static remove(tag){
        let record = this.records[tag.name],
            index = record.indexOf(tag.value);

        if(index === -1)
            return;

        record.splice(index, 1);

        if(!record.length)
            delete this.records[tag.name];
    }
}

