import { Query, Document } from "mongoose";
import { ParsedQs } from "qs";

interface APIFeaturesInterface<T extends Document> {
  query: Query<T[], T>;
  queryString: ParsedQs;
}

class APIFeatures<T extends Document> implements APIFeaturesInterface<T> {
  query: Query<T[], T>;
  queryString: ParsedQs;

  constructor(query: Query<T[], T>, queryString: ParsedQs) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering for greater than, less than, etc.
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    // Add search functionality
    if (typeof this.queryString.search === "string") {
      try {
        this.query = this.query.find({
          $text: { $search: this.queryString.search },
        });
      } catch (error) {
        console.warn(
          "Text search failed. Ensure text index is set up properly."
        );
      }
    }

    return this;
  }

  sort() {
    if (typeof this.queryString.sort === "string") {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (typeof this.queryString.fields === "string") {
      const fields = this.queryString.fields.split(",").join(" ");
      // Ensure _id is always included unless explicitly excluded
      this.query = this.query.select(
        fields.includes("-_id") ? fields : `${fields} _id`
      );
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page =
      typeof this.queryString.page === "string"
        ? parseInt(this.queryString.page)
        : 1;
    const limit =
      typeof this.queryString.limit === "string"
        ? parseInt(this.queryString.limit)
        : 10;
    const skip = (Math.max(1, page) - 1) * Math.max(1, Math.min(100, limit));

    this.query = this.query.skip(skip).limit(Math.max(1, Math.min(100, limit)));

    return this;
  }

  async execute(): Promise<T[]> {
    try {
      return await this.query;
    } catch (error) {
      console.error("Error executing query:", error);
      throw new Error("Failed to execute query");
    }
  }
}

export default APIFeatures;
