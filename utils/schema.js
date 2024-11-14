import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const MockInterviewScheme = pgTable("MockInterview", {
    id: serial('id').primaryKey(),
    jsonMockResp: text('jsonMockResp').notNull(),
    jobPosition: varchar('jobPosition').notNull(),
    jobDescription: varchar('jobDescription').notNull(),
    jobExperience: varchar('jobExperience').notNull(),
    createdBy: varchar('createdBy').notNull(),
    createdAt: varchar('createdAt'),  // Changed to timestamp
    mockId: varchar('mockId').notNull()
});


export const UserAnswerSchema = pgTable("UserAnswerSchema", {
    id: serial('id').primaryKey(),
    mockIdRef: varchar('mockIdRef').notNull(),
    question: varchar('question'),
    correctAns:text('correctAns'),
    UserAns: text('UserAns'),
    feedback:text("feedback"),
    rating:varchar("rating"),
    userEmail:varchar("userEmail"),
    createdAt: varchar('createdAt')
    
});
