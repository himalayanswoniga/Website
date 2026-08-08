/**
 * Shared list helper: applies filter, search, sort, and pagination to a Mongoose model
 * and returns { data, meta } in the shape every list endpoint responds with.
 */
export async function paginate(model, { filter = {}, query, searchFields = [], defaultSort = '-createdAt', populate }) {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 10, 1), 100);
  const sort = query.sort || defaultSort;

  const finalFilter = { ...filter };
  if (query.search && searchFields.length) {
    finalFilter.$or = searchFields.map((field) => ({
      [field]: { $regex: query.search, $options: 'i' },
    }));
  }

  let dbQuery = model.find(finalFilter).sort(sort).skip((page - 1) * limit).limit(limit);
  if (populate) dbQuery = dbQuery.populate(populate);

  const [data, total] = await Promise.all([dbQuery, model.countDocuments(finalFilter)]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
