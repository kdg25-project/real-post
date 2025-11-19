export * from "./auth-schema";
import { pgTable, text, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const survey = pgTable("survey", {
  id: uuid("id").primaryKey(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  imagesUrls: text("images_urls").array(),
  gender: text({ enum: ["male", "female", "other"] }),
  ageGroup: text({ enum: ["18-24", "25-34", "35-44", "45-54", "55+"] }),
  satisfactionLevel: integer("satisfaction_level"),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const favorite = pgTable("favorite", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  surveyId: uuid("survey_id")
    .notNull()
    .references(() => survey.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const goods = pgTable("goods", {
  id: uuid("id").primaryKey(),
  componeyId: text("company_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});