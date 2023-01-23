export const hexToString = (hex) => {
  const buffer = new Buffer(hex, "hex");
  return buffer.toString("utf8");
};
