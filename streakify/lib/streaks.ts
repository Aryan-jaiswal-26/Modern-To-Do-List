type ScheduleType = "daily" | "weekdays" | "custom";

export type GoalRecord = {
  scheduleType: ScheduleType;
  scheduleDays: number[];
};

export type GoalCompletionRecord = {
  date: string | Date;
};

function isScheduledDay(goal: GoalRecord, date: Date) {
  const day = date.getDay();
  if (goal.scheduleType === "daily") return true;
  if (goal.scheduleType === "weekdays") return day >= 1 && day <= 5;
  if (goal.scheduleType === "custom") return goal.scheduleDays.includes(day);
  return false;
}

export function calculateStreaks(goal: GoalRecord, completions: GoalCompletionRecord[]) {
  const completionDates = completions
    .map((completion) => new Date(completion.date))
    .sort((a, b) => b.getTime() - a.getTime());

  let current = 0;
  let best = 0;
  let streak = 0;
  let pointer = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let offset = 0; offset < 365; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);

    if (!isScheduledDay(goal, date)) {
      continue;
    }

    const completed = completionDates[pointer] && sameDay(completionDates[pointer], date);
    if (completed) {
      streak += 1;
      pointer += 1;
      current = current || streak;
      best = Math.max(best, streak);
    } else {
      if (offset === 0) {
        current = 0;
      } else if (streak > 0 && current === 0) {
        current = streak;
      }
      streak = 0;
    }
  }

  if (current === 0) {
    current = streak;
  }

  return { current, best };
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function scheduledDatesBetween(goal: GoalRecord, start: Date, end: Date) {
  const dates: Date[] = [];
  const begin = new Date(start);
  begin.setHours(0, 0, 0, 0);
  const finish = new Date(end);
  finish.setHours(0, 0, 0, 0);

  while (begin <= finish) {
    if (isScheduledDay(goal, begin)) {
      dates.push(new Date(begin));
    }
    begin.setDate(begin.getDate() + 1);
  }

  return dates;
}
