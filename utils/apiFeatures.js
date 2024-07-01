class APIFeatures {
	constructor(query, queryString, modelName) {
		this.query = query;
		this.queryString = queryString;
	}
	// Filtering based on query string parameters
	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ["page", "sort", "limit", "fields"];
		excludedFields.forEach(el => delete queryObj[el]);

		// Advanced filtering (e.g., price[gte]=500)
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		this.query = this.query.find(JSON.parse(queryStr));

		return this;
	}

	// Sorting based on query string parameters
	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(",").join(" ");
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt"); // Default sort
		}
		// Conditionally populate categories for Product model
		if (this.modelName === "Product") {
			this.query = this.query.populate("categories");
		}
		return this;
	}

	// Limiting fields returned in the query
	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(",").join(" ");
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select("-__v");
		}
		return this;
	}

	// Pagination based on page and limit query string parameters
	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}
module.exports = APIFeatures;
