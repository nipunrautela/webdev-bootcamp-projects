
exports.getDate = function() {
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  };

  return new Date().toLocaleString("en-us", options);
}


exports.getDay = function() {
  const options = {
    weekday: "long"
  };

  return new Date().toLocaleString("en-us", options);
}
