import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function getS3Config() {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const bucket = process.env.AWS_S3_BUCKET;

  if (!region) throw new Error("AWS_REGION is required");
  if (!accessKeyId) throw new Error("AWS_ACCESS_KEY_ID is required");
  if (!secretAccessKey) throw new Error("AWS_SECRET_ACCESS_KEY is required");
  if (!bucket) throw new Error("AWS_S3_BUCKET is required");

  return { region, accessKeyId, secretAccessKey, bucket };
}

function createS3Client() {
  const { region, accessKeyId, secretAccessKey } = getS3Config();
  return new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function getUploadUrl(key: string, contentType: string) {
  const { bucket } = getS3Config();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType,
  });
  return getSignedUrl(createS3Client(), command, { expiresIn: 3600 });
}

export async function getViewUrl(key: string) {
  const { bucket } = getS3Config();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });
  return getSignedUrl(createS3Client(), command, { expiresIn: 3600 });
}

export async function deleteObject(key: string) {
  const { bucket } = getS3Config();
  const s3 = createS3Client();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}