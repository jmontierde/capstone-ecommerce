const { match } = require("assert");

class APIFeatures { 
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    // get the keyword for filtering the products
    search(){ 
        const keyword = this.queryStr.keyword ?{
            // to search the name
            name: { 
                $regex: this.queryStr.keyword,
                $options: 'i' // i is for case sensitive
            }   
        } : {}

        this.query = this.query.find({...keyword})
        return this;
    }

    // Filter the products through categories    
    filter() { 
        const queryCopy = {...this.queryStr };
        // Removing fields from the query 
        const removeFields = ['keyword', 'limit', 'page']
        removeFields.forEach((field) => delete queryCopy[field]);

        // console.log(queryCopy);
        // Advance filter for price, ratings, etc
        let queryStr = JSON.stringify(queryCopy)
        // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `₱${match}`)

  
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    // Pagination
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

    // sort() {
    //     if (this.queryString.sortBy) {
    //       let sortBy = this.queryString.sortBy.split(',').join(' ');
    //       if (sortBy === 'price') {
    //         sortBy = '-price';
    //       }
    //       this.query = this.query.sort(sortBy);
    //     } else {
    //       this.query = this.query.sort('-createdAt');
    //     }
    //     return this;
    // }
    


}

module.exports = APIFeatures