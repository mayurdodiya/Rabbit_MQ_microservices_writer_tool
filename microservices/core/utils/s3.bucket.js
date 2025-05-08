const multer = require("multer");
var AWS = require("aws-sdk");
const { log } = require("wt-lib/logger.lib");
const sharp = require("sharp");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

AWS.config.update({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRET_KEY,
  region: process.env.REGION,
});

const s3 = new AWS.S3();

const uploadFile = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 20, files: 10 },
});

const processFile = async (file, directory) => {
  const fileName = `${directory}${uuidv4()}.webp`;

  const webpBuffer = await sharp(file.buffer)
    // .resize({ width: 300 })
    .webp()
    .toBuffer();

  const params = {
    Bucket: process.env.BUCKET,
    Key: fileName,
    Body: webpBuffer,
    ContentType: "image/webp",
  };

  await s3.upload(params).promise();

  return `https://${params.Bucket}.s3.${process.env.REGION}.amazonaws.com/${params.Key}`;
};

const uploadAndProcessFiles = async (req, res, next) => {
  try {
    if (req.file) {
      let directory = "upload/images/";
      if (req.file.fieldname === "coverPhoto") {
        directory = "images/blogs/coverPhoto/";
      } else if (req.file.fieldname === "profileImage") {
        directory = "images/users/profileImage/";
      }

      const fileUrl = await processFile(req.file, directory);
      req.file.location = fileUrl;
    }
    next();
  } catch (error) {
    log.error("Error processing file:", error);
    next(error);
  }
};

const deleteFile = (key) => {
  let splitKey = key?.split("/");
  const params = {
    Bucket: process.env.BUCKET,
    Key: `${splitKey?.[3]}`,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) log.error("File deletion error: ", err, err.stack);
    // an error occurred
    else {
      log.info(data);
    } // successful response
  });
};

const getAllImage = () => {
  const listParams = {
    Bucket: process.env.BUCKET,
  };

  // Retrieve a list of all objects in the bucket
  s3.listObjects(listParams, function (err, data) {
    if (err) {
      log.error("Error retrieving object list: ", err);
    } else {
      log.info("Object list retrieved successfully");

      // Filter the list to include only image files
      const imageList = data.Contents.filter(function (obj) {
        return obj.Key.match(/\.(jpg|jpeg|png|gif)$/);
      });

      // Log the list of image files
      log.info("Image list: ", imageList);
    }
  });
};

// Function to convert image to webp format and generate thumbnail
const generateThumbnail = async (imagePath) => {
  try {
    // Read and process the image with sharp
    const response = await axios.get(imagePath, {
      responseType: "arraybuffer",
    });
    const imageBuffer = Buffer.from(response.data, "binary");

    const buffer = await sharp(imageBuffer)
      .resize({
        width: 720,
        fit: "inside", // Keeps aspect ratio and fits within the dimensions
        withoutEnlargement: true, // Avoid enlarging smaller images
      })
      .webp({ quality: 100 })
      .toBuffer();

    const bucket = process.env.BUCKET;
    const fileName = "images/blogs/thumbnail/" + Date.now().toString();

    // Upload buffer to S3 and return the URL
    const URL = await uploadBufferToS3(buffer, bucket, fileName)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        log.error("Failed to upload image:", error);
        throw new Error(
          "Failed the thumbnail upload!!! Please try again later"
        );
      });

    return URL;
  } catch (error) {
    log.error("Error generating thumbnail:", error);
    throw new Error("Failed the thumbnail upload!!! Please try again later");
  }
};
// Upload thumbnail to S3 bucket
const uploadBufferToS3 = async (buffer, bucket, fileName) => {
  try {
    const params = {
      Bucket: process.env.BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: "image/webp", // Update with your desired content type
    };
    const data = await s3.upload(params).promise();
    log.info("File uploaded successfully:", data.Location);
    return data.Location;
  } catch (error) {
    log.error("Error uploading file to S3:", error);
    throw new Error("Error uploading file to S3:", error);
  }
};

const dynamicFileUpload = async (req, res, next) => {
  // Check if coverPhoto is provided and is a string
  try {
    if (req.body?.coverPhoto && typeof req.body?.coverPhoto === "string") {
      const thumbnail = await generateThumbnail(req.body.coverPhoto);
      req.thumbnail = thumbnail;
      req.coverPhoto = req.body.coverPhoto;
      return next();
    }

    if (req.file) {
      await uploadAndProcessFiles(req, res, (error) => {
        if (error) {
          return next(new Error(`Failed to process file: ${error.message}`));
        }
        next();
      });
    } else {
      // If neither string nor file is provided, return an error
      return next(new Error("Invalid coverPhoto payload"));
    }
  } catch (error) {
    console.error("Error in dynamicFileUpload middleware:", error);
    return next(error);
  }
};

module.exports = {
  uploadFile,
  uploadAndProcessFiles,
  generateThumbnail,
  deleteFile,
  getAllImage,
  uploadBufferToS3,
  dynamicFileUpload,
};
