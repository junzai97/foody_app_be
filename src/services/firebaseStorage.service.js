const { bucket } = require("../config/firebase");
const stream = require("stream");
const { getContentType, getBase64Content } = require("../utils/base64.utils");
const { getContentType, getBase64Content } = require("../utils/base64.utils");
const AttachmentType = require("../enums/attachmentType.enum");
const Storage = require("../entities/storage.entity");

const BUCKET_NAME = "foodie-vlog-27dc6";

async function uploadFiles(
  attachmentDTO,
  attachmentType = AttachmentType.OTHERS
) {
  const path = `${attachmentType}/${attachmentDTO.filename}`;
  const file = bucket.file(path);
  const base64Content = getBase64Content(attachmentDTO.base64String);
  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(base64Content, "base64"));
  //Pipe the 'bufferStream' into a 'file.createWriteStream' method.
  bufferStream
    .pipe(
      file.createWriteStream({
        metadata: { contentType: getContentType(attachmentDTO.base64String) },
        public: true,
        validation: "md5",
      })
    )
    .on("error", function (err) {
      console.error("error when uploading file to cloud storage: ", err);
    })
    .on("finish", async function () {
      try {
        const signedUrls = await file.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        const publicUrl = signedUrls[0];
        return new Storage(
          null,
          attachmentDTO.filename,
          BUCKET_NAME,
          publicUrl,
          toMysqlTimestampString(new Date()),
          toMysqlTimestampString(new Date())
        );
      } catch (error) {
        console.error("error when getting file publicUrl: ", error);
      }
    });
}

// async function uploadBase64() {
//   const type = "try";
//   const filename = "trying_from_node.jpg";

//   const metadata = { contentType: "image/jpeg; charset=utf-8" };
//   const storageRef = storage.ref().child(`${type}/${filename}`);
//   const snapshot = storageRef.putString(message, "base64");
// }

// async function downloadFile() {
//   const options = {
//     // The path to which the file should be downloaded, e.g. "./file.txt"
//     destination: destFilename,
//   };

//   // Downloads the file
//   await storage.bucket(bucketName).file(srcFilename).download(options);

//   console.log(
//     `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
//   );
// }

// downloadFile().catch(console.error);

module.exports = {
  uploadFiles,
};
