/**
 * logicHelpers.js
 * @author Ben Sonley
 * @description helper functions to determine state of data
 */

export default {
  /**
   * arrayHasValue
   * @param {Object} array array of object to be checked for a value
   * @param {String} value id to find in the Array
   * @returns {Boolean} true if array contains a matching object
   */
  arrayHasValue(array, value) {
    return array.find(item => item.id === value);
  },

  matchUserId(array, value) {
    return array.find(item => item.userId === value);
  },

  matchEventId(array, value) {
    return array.find(item => item.eventId === value);
  },

  matchEventAndUserId(array, eventId, userId) {
    return array.find(
      item => item.eventId === eventId && item.userId === userId,
    );
  },
};
