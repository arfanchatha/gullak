class APIFeatures {
  constructor(mongoQuery, userQuery) {
    this.mongoQuery = mongoQuery;
    this.userQuery = userQuery;
  }
  filter() {
    // filtering

    const queryObj = { ...this.userQuery };
    const excludedqueries = ["limit", "page", "sort", "fields"];

    excludedqueries.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongoQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    // sorting
    if (this.userQuery.sort) {
      const sort = this.userQuery.sort.split(",").join(" ");

      this.mongoQuery.sort(sort);
    } else {
      this.mongoQuery.sort("-createdAt");
    }
    return this;
  }
  selectFields() {
    // select field

    if (this.userQuery.fields) {
      const fields = this.userQuery.fields.split(",").join(" ");
      this.mongoQuery.select(fields);
    } else {
      this.mongoQuery.select("-__v");
    }
    return this;
  }
  paginate() {
    // paginations
    const page = this.userQuery.page * 1 || 1;
    const limit = this.userQuery.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.mongoQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
