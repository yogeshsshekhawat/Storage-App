import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import fs from "node:fs";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl as getCloudFrontSignedUrl } from "@aws-sdk/cloudfront-signer";

// Initialize S3 client using environment variables loaded by --env-file
const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  region: process.env.AWS_REGION || "us-east-1",
});

/**
 * Generate a presigned PUT URL for the frontend to upload a file directly to S3.
 * @param {string} key - S3 object key (usually file ID + extension)
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<string>}
 */
export const getPresignedUploadUrl = async (key, contentType) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: key,
    ContentType: contentType,
  });
  // URL expires in 15 minutes (900 seconds)
  return await getSignedUrl(s3Client, command, { expiresIn: 900 });
};

/**
 * Generate a signed CDN URL (via CloudFront) or fallback presigned GET URL (via S3) for download or inline view.
 * @param {string} key - S3 object key
 * @param {string} originalFilename - Original filename for Content-Disposition
 * @param {string} action - 'download' or 'view'
 * @returns {Promise<string>}
 */
export const getPresignedDownloadUrl = async (key, originalFilename, action) => {
  let disposition = "";
  if (action === "download") {
    disposition = `attachment; filename="${encodeURIComponent(originalFilename)}"`;
  } else {
    disposition = `inline; filename="${encodeURIComponent(originalFilename)}"`;
  }

  const cleanEnvVar = (val) => {
    if (!val) return "";
    let s = val.trim();
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
      s = s.slice(1, -1);
    }
    return s.trim();
  };

  const cfUrl = cleanEnvVar(process.env.CLOUDFRONT_URL);
  const cfKeyPairId = cleanEnvVar(process.env.CLOUDFRONT_KEY_PAIR_ID);
  const cfPrivateKey = cleanEnvVar(process.env.CLOUDFRONT_PRIVATE_KEY);

  const isValidCfKeyId = (id) => {
    return /^[K][A-Z0-9]{11,14}$/.test(id);
  };

  const isCloudFrontConfigured = cfUrl && cfKeyPairId && cfPrivateKey && isValidCfKeyId(cfKeyPairId);

  if (cfUrl && cfKeyPairId && cfPrivateKey && !isValidCfKeyId(cfKeyPairId)) {
    console.warn(`WARNING: CloudFront Key Pair ID "${cfKeyPairId}" does not match the expected AWS 14-character format starting with 'K'. Falling back to secure S3 Presigned URL.`);
  }

  if (isCloudFrontConfigured) {
    try {
      let cfBase = cfUrl;
      if (!cfBase.startsWith("http://") && !cfBase.startsWith("https://")) {
        cfBase = `https://${cfBase}`;
      }

      // Base resource path to sign
      const cloudFrontBaseUrl = `${cfBase.replace(/\/$/, "")}/${key}`;

      // Wildcard custom policy allowing subsequent query parameters to be appended safely
      const customPolicy = JSON.stringify({
        Statement: [
          {
            Resource: `${cloudFrontBaseUrl}*`,
            Condition: {
              DateLessThan: {
                "AWS:EpochTime": Math.floor((Date.now() + 3600 * 1000) / 1000), // Expires in 1 hour
              },
            },
          },
        ],
      });

      const signedBase = getCloudFrontSignedUrl({
        url: cloudFrontBaseUrl,
        policy: customPolicy,
        keyPairId: cfKeyPairId,
        privateKey: cfPrivateKey.replace(/\\n/g, "\n"), // Handle raw string and file-based newline configurations
      });

      // Append custom query parameters at the end (allowed due to wildcard policy resource)
      const signedUrlWithParams = `${signedBase}&response-content-disposition=${encodeURIComponent(disposition)}`;

      try {
        fs.writeFileSync("scratch/signed_url.txt", signedUrlWithParams);
      } catch (e) {
        console.error("Failed to write signed URL to file", e);
      }

      return signedUrlWithParams;
    } catch (err) {
      console.error("Error generating CloudFront signed URL, falling back to S3 presigned URL:", err);
    }
  }

  // Graceful fallback to S3 Presigned URL
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: key,
    ResponseContentDisposition: disposition,
  };

  const command = new GetObjectCommand(params);
  // URL expires in 1 hour (3600 seconds)
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

/**
 * Delete a file object from S3.
 * @param {string} key - S3 object key
 * @returns {Promise<any>}
 */
export const deleteFromS3 = async (key) => {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME || "",
    Key: key,
  });
  return await s3Client.send(command);
};

/**
 * Stream/upload helper using @aws-sdk/lib-storage.
 * Useful if the backend ever needs to upload file streams directly to S3.
 * @param {string} key - S3 object key
 * @param {any} stream - Readable stream or file buffer
 * @param {string} contentType - MIME type of the file
 * @returns {Promise<any>}
 */
export const uploadStreamToS3 = async (key, stream, contentType) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: process.env.AWS_BUCKET_NAME || "",
      Key: key,
      Body: stream,
      ContentType: contentType,
    },
  });
  return await upload.done();
};
