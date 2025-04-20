// Create timestamp for filename
exports.getLogFileName = (name) => {
  const now = new Date();
  return `${name}_${now.getDate()}_${
    now.getMonth() + 1
  }_${now.getFullYear()}_${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}.log`;
};
