import { z } from "zod";

export const customerSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email"),
  phone: z.string().min(7, "Invalid phone").max(20),
  company: z.string().min(1, "Company is required"),
  country: z.string().min(1, "Country is required"),
  status: z.enum(["Active", "Inactive"]),
});

export const documentSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  fileSize: z.number().max(1024 * 1024 * 500, "Max file size is 500MB"),
  customerId: z.string().min(1),
  pages: z.number().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(1000),
  page: z.number().min(1),
  author: z.string().min(1),
});

export const annotationSchema = z.object({
  page: z.number().min(1),
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
  color: z.string().optional(),
  note: z.string().max(500).optional(),
  author: z.string().min(1),
});