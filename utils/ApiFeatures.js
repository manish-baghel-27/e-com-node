class ApiFeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    sort(){
        if (this.queryStr.sort) {
            // const sortBy = this.queryStr.sort().split(',').join(' ');
            // this.query = this.query.sort(sortBy);
        }else{
            // this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    pagination(){
        // const page = this.query.page*1 || 1;
        // const limit = this.query.limit * 1 || 10;
        // const skip = (page-1)*limit;
        // this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
module.exports=ApiFeatures;