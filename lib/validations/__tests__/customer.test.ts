import {
  annotationSchema,
  commentSchema,
  customerSchema,
  documentSchema,
} from "@/lib/validations/customer";

describe("customerSchema", () => {
  it("accepts a valid customer payload", () => {
    const result = customerSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "1234567890",
      company: "Acme Insurance",
      country: "India",
      status: "Active",
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = customerSchema.safeParse({
      name: "Jane Doe",
      email: "invalid-email",
      phone: "1234567890",
      company: "Acme Insurance",
      country: "India",
      status: "Active",
    });

    expect(result.success).toBe(false);
  });
});

describe("documentSchema", () => {
  it("rejects files bigger than 500MB", () => {
    const result = documentSchema.safeParse({
      fileName: "claim.pdf",
      fileType: "application/pdf",
      fileSize: 1024 * 1024 * 501,
      customerId: "cus_123",
      pages: 10,
    });

    expect(result.success).toBe(false);
  });
});

describe("commentSchema", () => {
  it("rejects empty comment content", () => {
    const result = commentSchema.safeParse({
      content: "",
      page: 1,
      author: "agent",
    });

    expect(result.success).toBe(false);
  });
});

describe("annotationSchema", () => {
  it("accepts a valid annotation payload", () => {
    const result = annotationSchema.safeParse({
      page: 1,
      x: 10,
      y: 20,
      width: 120,
      height: 60,
      color: "#FFEB3B",
      note: "Check this section",
      author: "agent",
    });

    expect(result.success).toBe(true);
  });
});
