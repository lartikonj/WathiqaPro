import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forms = pgTable("forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  category: text("category").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  schema: jsonb("schema").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const savedForms = pgTable("saved_forms", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  formId: integer("form_id").references(() => forms.id).notNull(),
  formData: jsonb("form_data").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const generatedDocuments = pgTable("generated_documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  formId: integer("form_id").references(() => forms.id).notNull(),
  title: text("title").notNull(),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertFormSchema = createInsertSchema(forms).omit({
  id: true,
});

export const insertSavedFormSchema = createInsertSchema(savedForms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeneratedDocumentSchema = createInsertSchema(generatedDocuments).omit({
  id: true,
  generatedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Form = typeof forms.$inferSelect;
export type InsertForm = z.infer<typeof insertFormSchema>;
export type SavedForm = typeof savedForms.$inferSelect;
export type InsertSavedForm = z.infer<typeof insertSavedFormSchema>;
export type GeneratedDocument = typeof generatedDocuments.$inferSelect;
export type InsertGeneratedDocument = z.infer<typeof insertGeneratedDocumentSchema>;
