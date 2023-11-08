const { match } = require("assert");

class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  // get the keyword for filtering the products
  // search(){
  //     const keyword = this.queryStr.keyword ?{
  //         // to search the name
  //         name: {
  //             $regex: this.queryStr.keyword,
  //             $options: 'i' // i is for case sensitive
  //         }
  //     } : {}

  //     this.query = this.query.find({...keyword})
  //     return this;
  // }

  // Pagination
  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
