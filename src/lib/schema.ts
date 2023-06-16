import { z } from "zod";

const minUsername = 4;
const minPassword = 4;
const regExpUsername = /^[a-zA-Z0-9_.]*$/;

enum Gender {
  Male = "Male",
  Female = "Female",
  Others = "Others",
}

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(minUsername)
    .regex(regExpUsername),
  password: z.string().min(minPassword),
  email: z.preprocess((field) => {
    if (!field || typeof field !== "string" || field.trim() === "") return null;
    return field.trim();
  }, z.string().email().toLowerCase().nullable()),
  prefix: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(minUsername)
    .regex(/^[a-zA-Z0-9]*$/),
  password: z.string().min(minPassword),
});

export const userSchema = z.object({
  id: z.string().cuid(),
  username: z.string(),
  password: z.string(),
  salt: z.string(),
  email: z.string().nullable(),
  prefix: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const doctorSchema = z.object({
  userId: z.string(),
});

export const patientSchema = z.object({
  userId: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  birthDate: z.date(),
  ethnicity: z.string().nullable(),
});

export const adminSchema = z.object({
  userId: z.string(),
});

export const fileSchema = z.object({
  id: z.string(),
  uri: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  name: z.string(),
  red: z.number(),
  yellow: z.number(),
  green: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticBrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const medicalConditionSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticRecordSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  patientId: z.string(),
  fileId: z.string().nullable(),
  result: z.any().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticBrandProbioticRecordSchema = z.object({
  id: z.number(),
  probioticBrandId: z.number(),
  probioticRecordId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const medicalConditionPatientSchema = z.object({
  id: z.number(),
  medicalConditionId: z.number(),
  patientId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});