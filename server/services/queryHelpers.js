const { ObjectId } = require('mongodb');

const getMongoId = (idString, res) => {
  // convert the id string to a MongoDB ObjectId
  try {
    return ObjectId(idString);
  } catch (error) {
    return res
      .status(422)
      .json({ message: `Invalid issue ID format: ${error}` });
  }
};

module.exports = {
  getMongoId,
};
