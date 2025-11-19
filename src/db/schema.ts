export * from "./auth-schema";
import { pgTable, text, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export const survey = pgTable("survey", {
  id: uuid("id").primaryKey(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  gender: text("gender", { enum: ["male", "female", "other"] }),
  ageGroup: text("age_group", { enum: ["18-24", "25-34", "35-44", "45-54", "55+"] }),
  satisfactionLevel: integer("satisfaction_level"),
  country: varchar("country", { length: 100 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const surveyToken = pgTable("survey_token", {
  id: uuid("id").primaryKey(),
  surveyId: uuid("survey_id")
    .notNull()
    .references(() => survey.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  remainingCount: integer("remaining_count").notNull(),
  expiredAt: timestamp("expired_at", { mode: "date" }).notNull().$default(
    () => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      return date;
    }
  ),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const surveyImage = pgTable("survey_image", {
  id: uuid("id").primaryKey(),
  surveyId: uuid("survey_id")
    .notNull()
    .references(() => survey.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const favorite = pgTable("favorite", {
  id: uuid("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  surveyId: uuid("survey_id")
    .notNull()
    .references(() => survey.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const goods = pgTable("goods", {
  id: uuid("id").primaryKey(),
  companyId: text("company_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const goodsImage = pgTable("goods_image", {
  id: uuid("id").primaryKey(),
  goodsId: uuid("goods_id")
    .notNull()
    .references(() => goods.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}); 