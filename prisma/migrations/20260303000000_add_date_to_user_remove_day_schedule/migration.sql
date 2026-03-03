-- Step 1: drop foreign key from DayScheduleUser before dropping tables
ALTER TABLE "DayScheduleUser" DROP CONSTRAINT IF EXISTS "DayScheduleUser_userId_fkey";
ALTER TABLE "DayScheduleUser" DROP CONSTRAINT IF EXISTS "DayScheduleUser_dayScheduleId_fkey";

-- Step 2: add date column as nullable first so existing rows don't fail
ALTER TABLE "User" ADD COLUMN "date" TIMESTAMP(3);

-- Step 3: fill date from startTime (truncated to day) for existing rows
UPDATE "User" SET "date" = DATE_TRUNC('day', "startTime");

-- Step 4: make date NOT NULL now that all rows have a value
ALTER TABLE "User" ALTER COLUMN "date" SET NOT NULL;

-- Step 5: drop junction table and day schedule table
DROP TABLE IF EXISTS "DayScheduleUser";
DROP TABLE IF EXISTS "DaySchedule";
