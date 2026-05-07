const mockSignedUrl = jest.fn();
const mockSend = jest.fn();
const s3CtorMock = jest.fn();
const putCommandMock = jest.fn();
const getCommandMock = jest.fn();
const deleteCommandMock = jest.fn();

jest.mock("@aws-sdk/client-s3", () => ({
  S3Client: jest.fn().mockImplementation((config: unknown) => {
    s3CtorMock(config);
    return { send: mockSend };
  }),
  PutObjectCommand: jest.fn().mockImplementation((input: unknown) => {
    putCommandMock(input);
    return { input, type: "put" };
  }),
  GetObjectCommand: jest.fn().mockImplementation((input: unknown) => {
    getCommandMock(input);
    return { input, type: "get" };
  }),
  DeleteObjectCommand: jest.fn().mockImplementation((input: unknown) => {
    deleteCommandMock(input);
    return { input, type: "delete" };
  }),
}));

jest.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: jest.fn((...args: unknown[]) => mockSignedUrl(...args)),
}));

import { deleteObject, getUploadUrl, getViewUrl } from "@/lib/s3";

describe("s3 helpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      AWS_REGION: "ap-south-1",
      AWS_ACCESS_KEY_ID: "key",
      AWS_SECRET_ACCESS_KEY: "secret",
      AWS_S3_BUCKET: "bucket",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("creates upload signed URL", async () => {
    mockSignedUrl.mockResolvedValueOnce("https://upload-url");

    const result = await getUploadUrl("docs/file.pdf", "application/pdf");

    expect(putCommandMock).toHaveBeenCalledWith({
      Bucket: "bucket",
      Key: "docs/file.pdf",
      ContentType: "application/pdf",
    });
    expect(result).toBe("https://upload-url");
  });

  it("creates view signed URL", async () => {
    mockSignedUrl.mockResolvedValueOnce("https://view-url");

    const result = await getViewUrl("docs/file.pdf");

    expect(getCommandMock).toHaveBeenCalledWith({
      Bucket: "bucket",
      Key: "docs/file.pdf",
    });
    expect(result).toBe("https://view-url");
  });

  it("deletes object from bucket", async () => {
    await deleteObject("docs/file.pdf");

    expect(s3CtorMock).toHaveBeenCalledWith({
      region: "ap-south-1",
      credentials: {
        accessKeyId: "key",
        secretAccessKey: "secret",
      },
    });
    expect(deleteCommandMock).toHaveBeenCalledWith({
      Bucket: "bucket",
      Key: "docs/file.pdf",
    });
    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
