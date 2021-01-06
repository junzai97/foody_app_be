/**
 * 
 * @example 
 * actual = {"key1": 1}
 * expected = {"key2": 1}
 * will return false
 * 
 * @example
 * actual = {"key1": 1}
 * expected = {"key2": 1}
 * ignoredKeys = ["key2"]
 * will return true
 */
function hasMissingKey(actual, expected, ignoredKeys = []) {
  if (!isObject(expected)) {
    throw new Error("'expected' must be an object");
  }
  if (!isObject(actual)) {
    return true;
  }
  var actualKeys = Object.keys(actual).sort();
  var expectedKeys = Object.keys(expected).sort();
  return expectedKeys
    .filter((key) => !ignoredKeys.includes(key))
    .some((key) => !actualKeys.includes(key));
}

/**
 * 
 * @description check the param is a javascript object or not 
 */
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

module.exports = {
  hasMissingKey,
  isObject,
};
