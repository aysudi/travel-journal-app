const formatMongoData = (doc: any) => {
  if (Array.isArray(doc)) {
    return doc.map(formatDocument);
  } else if (doc && typeof doc === "object") {
    return formatDocument(doc);
  }

  return doc;
};

const formatDocument = (item: any) => {
  const obj = item.toObject
    ? item.toObject({ depopulate: false })
    : { ...item };
  const { _id, public_id, ...rest } = obj;

  return {
    id: _id?.toString(),
    ...rest,
  };
};

export default formatMongoData;
