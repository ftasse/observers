class QueryHelper {
  constructor(mongooseQuery, queryStr) {
    this.query = mongooseQuery;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/,
      match => `$${match}`
    );

    // Make case-insensitive queries
    const queryStringWithPattern = JSON.parse(queryString);
    Object.entries(queryStringWithPattern).forEach(([k, v]) => {
      if (k !== 'createdAt')
        queryStringWithPattern[k] = new RegExp(
          `.*${unescape(v.toString())}.*`,
          'i'
        );
    });

    if (queryStringWithPattern.createdAt) {
      const queryDateDay = new Date(queryStringWithPattern.createdAt);
      const queryDateNextDay = new Date(
        queryDateDay.getTime() + 24 * 60 * 60 * 1000
      );
      queryStringWithPattern.createdAt = {
        $gte: queryDateDay,
        $lt: queryDateNextDay
      };
    }
    this.query = this.query.find(queryStringWithPattern);

    return this;
  }
  search() {
    if (this.queryStr.search) {
      const searchText = this.queryStr.search;
      this.query = this.query.find({ $text: { $search: searchText } });
    }
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 30;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = QueryHelper;
