import { integer,sqliteTable,text } from 'drizzle-orm/sqlite-core';
// Only anonymous, expiring request counters. No answers, profiles or reports.
export const reportQuota=sqliteTable('report_quota',{
 id:text('id').primaryKey(),used:integer('used').notNull(),expiresAt:integer('expires_at').notNull(),
});
