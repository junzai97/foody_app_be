const { bucket } = require("../config/firebase");
const stream = require("stream");
const { getContentType, getBase64Content } = require("../utils/base64.utils");
const { toMysqlTimestampString } = require("../utils/mysql.utils");
const AttachmentType = require("../enums/attachmentType.enum");
const Storage = require("../entities/storage.entity");

const BUCKET_NAME = "foodie-vlog-27dc6";

function uploadFiles(attachmentDTO, attachmentType = AttachmentType.OTHERS) {
  const path = `${attachmentType}/${attachmentDTO.filename}`;
  const file = bucket.file(path);
  const base64Content = getBase64Content(attachmentDTO.base64String);
  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(base64Content, "base64"));
  //Pipe the 'bufferStream' into a 'file.createWriteStream' method.
  return new Promise((resolve, reject) => {
    bufferStream
      .pipe(
        file.createWriteStream({
          metadata: { contentType: getContentType(attachmentDTO.base64String) },
          public: true,
          validation: "md5",
        })
      )
      .on("error", function (error) {
        console.error("error when uploading file to cloud storage: ", error);
        reject(error);
      })
      .on("finish", async function () {
        try {
          const signedUrls = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
          });
          const publicUrl = signedUrls[0];
          const storage = new Storage(
            null,
            attachmentDTO.filename,
            BUCKET_NAME,
            publicUrl,
            toMysqlTimestampString(new Date()),
            toMysqlTimestampString(new Date())
          );
          resolve(storage);
        } catch (error) {
          console.error("error when getting file publicUrl: ", error);
          reject(error);
        }
      });
  });
}

module.exports = {
  uploadFiles,
};
