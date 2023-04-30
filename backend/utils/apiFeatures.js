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


    // Pagination
    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }

    // sort() {
    //     if (this.queryStr.price) {
    //       const sortByPrice = this.queryStr.price.split(',').join('');
    //       this.query = this.query.sort({ price: sortByPrice }); 
    //     } else if (this.queryStr.alphabet) {
    //       const sortByAlphabet = this.queryStr.alphabet.split(',').join('');
    //       const sortField = sortByAlphabet === '1' ? 'name-asc' : 'name-desc';
    //       this.query = this.query.sort(sortField);
    //     }
    //     return this;
    // }
    

}

module.exports = APIFeatures