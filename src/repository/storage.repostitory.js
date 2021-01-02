const { connection } = require("../config/mysql");
const AttachmentDTO = require("../dtos/attachmentDTO.dto");
const AttachmentType = require("../enums/attachmentType.enum");
const { uploadFiles } = require("../services/firebaseStorage.service");
const { getFileExtension } = require("../utils/base64.utils");
const { createPlaceholderString } = require("../utils/mysql.utils");

async function createStorage(base64String, attachmentType = AttachmentType.OTHERS) {
  const fileName = `${attachmentType}_${new Date().toISOString()}.${getFileExtension(
    base64String
  )}`;
  const attachmentDTO = new AttachmentDTO(fileName, base64String);
  const storage = await uploadFiles(attachmentDTO, attachmentType);
  return new Promise((resolve, reject) => {
    connection.query(
      `INSERT INTO STORAGE (
          ID,
          FILE_NAME,
          BUCKET,
          MEDIA_LINK,
          CREATED_DATE,
          LAST_MODIFIED_DATE
        ) VALUES (${createPlaceholderString(6)})`,
      [
        storage.id,
        storage.fileName,
        storage.bucket,
        storage.mediaLink,
        storage.createdDate,
        storage.lastModifiedDate,
      ],
      (error, results, fields) => {
        error ? reject(error) : resolve(results);
      }
    );
  });
}

module.exports = {
  createStorage,
};
