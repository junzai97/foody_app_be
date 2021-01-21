const { connection } = require("../config/mysql");
const AttachmentDTO = require("../dtos/attachmentDTO.dto");
const Storage = require("../entities/storage.entity");
const AttachmentType = require("../enums/attachmentType.enum");
const { uploadFiles } = require("../services/firebaseStorage.service");
const { getFileExtension } = require("../utils/base64.utils");
const { createPlaceholderString } = require("../utils/mysql.utils");

async function createStorage(
  base64String,
  attachmentType = AttachmentType.OTHERS
) {
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

async function findOneStorage(storageId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM STORAGE WHERE id = ?",
      [storageId],
      (error, results, fields) => {
        const result = results[0];
        error
          ? reject(error)
          : resolve(
              new Storage(
                result.id,
                result.file_name,
                result.bucket,
                result.media_link,
                result.created_date,
                result.last_modified_date
              )
            );
      }
    );
  });
}

module.exports = {
  createStorage,
  findOneStorage,
};
