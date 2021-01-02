// "data:image/jpeg;base64,base64ContentStartsHere..."
function isBase64String(base64String) {
  return /^(.+)base64,(.*)/.test(base64String);
}

// "image/jpeg", "image/png"
function getContentType(base64String) {
  if (!isBase64String) {
    throw new Error("cannot getContentType for non base64String");
  }
  const endIndex = base64String.indexOf(";base64,");
  const startIndex = 5; // "data:"
  return base64String.substring(startIndex, endIndex);
}

// "jpeg", "png"
function getFileExtension(base64String) {
  return getContentType(base64String).replace(/^(.+)\//, "");
}

function getBase64Content(base64String) {
  if (!isBase64String) {
    throw new Error("cannot getBase64Content for non base64String");
  }
  return base64String.replace(/^(.+)base64,/, "");
}

module.exports = {
  isBase64String,
  getContentType,
  getFileExtension,
  getBase64Content,
};
