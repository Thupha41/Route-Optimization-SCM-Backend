"use strict";

import _ from "lodash";

const getInfoData = (fields = [], object = {}) => {
  return _.pick(object, fields);
};

const formatKeys = (object) => {
  return _.mapKeys(object, __options);
};

const removeNull = (object) => {
  return _.omitBy(object, _.isNil);
};
const __options = (value, key) => {
  if (key === "status") return "status";
  if (key === "priority") return "priority";
  if (key === "initialDate") return "initialDate";
  if (key === "deadline") return "deadline";
  return key;
};
module.exports = {
  getInfoData,
  formatKeys,
  removeNull,
};
