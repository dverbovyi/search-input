class Filter {
    constructor(){
        this.filterTypes = [];
    }

    register(type){
        if(!)
        this.filterTypes[type.name] = type;
    }

    apply(filterName, searchValue, source){
        return this.filterTypes[filterName].filter(searchValue, source);
    }

    add(){

    }
}