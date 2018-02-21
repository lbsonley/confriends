/**
 * validateResponse
 * @desc
 */

export default {
  validateResponse(response) {
    if (response.ok) {
      return response;
    }
    throw new Error(response.statusText);
  },

  parseJSON(response) {
    return response.json();
  },
};
