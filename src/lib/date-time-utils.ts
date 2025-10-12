// Shared date and time utilities for reservation forms

export const getJordanDate = () => {
  // Create a new date object in Jordan timezone (GMT+3)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const jordanOffset = 3; // GMT+3
  return new Date(utc + jordanOffset * 3600000);
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (date: Date) => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Generate time options for the entire day (every 15 minutes)
export const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      const timeString = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      times.push(timeString);
    }
  }
  return times;
};

export const getClosestTime = (currentTime: string, timeOptions: string[]) => {
  // If exact match exists, use it
  if (timeOptions.includes(currentTime)) {
    return currentTime;
  }

  // Parse the currentTime parameter to get minutes
  const [time, period] = currentTime.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let currentMinutes = hours * 60 + minutes;

  // Convert to 24-hour format
  if (period === "PM" && hours !== 12) {
    currentMinutes += 12 * 60;
  } else if (period === "AM" && hours === 12) {
    currentMinutes -= 12 * 60;
  }

  let closestTime = timeOptions[0];
  let closestDiff = Infinity;

  timeOptions.forEach((timeOption) => {
    // Parse time option to get hours and minutes
    const [time, period] = timeOption.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let timeMinutes = hours * 60 + minutes;

    // Convert to 24-hour format
    if (period === "PM" && hours !== 12) {
      timeMinutes += 12 * 60;
    } else if (period === "AM" && hours === 12) {
      timeMinutes -= 12 * 60;
    }

    const diff = Math.abs(currentMinutes - timeMinutes);
    if (diff < closestDiff) {
      closestDiff = diff;
      closestTime = timeOption;
    }
  });

  return closestTime;
};

export const getMonthData = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  // Get the first day of the month
  const firstDayOfMonth = new Date(year, month, 1);

  // Get the last day of the month
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Calculate the start date (may be from previous month)
  const startDate = new Date(year, month, 1 - firstDayWeekday);

  // Generate calendar days
  const days = [];
  const current = new Date(startDate);

  // Generate enough days to fill the calendar grid (6 weeks = 42 days)
  // But we'll be smarter about when to show 5 vs 6 weeks
  const weeksNeeded = Math.ceil(
    (firstDayWeekday + lastDayOfMonth.getDate()) / 7
  );
  const totalDays = weeksNeeded * 7;

  for (let i = 0; i < totalDays; i++) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return { days };
};

export const isDateDisabled = (date: Date) => {
  const today = getJordanDate();
  today.setHours(0, 0, 0, 0);
  // Create date at noon to avoid timezone issues
  const compareDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    12,
    0,
    0
  );
  return compareDate < today;
};

// Convert formatted date and time strings to an ISO string representing Jordan time (UTC+3)
export function toJordanISO(dateStr: string, timeStr: string): string {
  // dateStr example: "Sat, Oct 11, 2025"
  // timeStr example: "4:00 PM"
  try {
    // Extract date parts
    const dateMatch = dateStr.match(
      /([A-Za-z]+),\s+([A-Za-z]+)\s+(\d+),\s+(\d+)/
    );
    if (!dateMatch) throw new Error("Invalid date string");
    const monthStr = dateMatch[2];
    const day = parseInt(dateMatch[3], 10);
    const year = parseInt(dateMatch[4], 10);

    const monthMap: { [k: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const month = monthMap[monthStr];

    // Extract time parts
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) throw new Error("Invalid time string");
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const mer = timeMatch[3].toUpperCase();
    if (mer === "PM" && hours !== 12) hours += 12;
    if (mer === "AM" && hours === 12) hours = 0;

    // Build UTC timestamp that corresponds to Jordan local time (UTC+3)
    const jordanUtcTimestamp =
      Date.UTC(year, month, day, hours, minutes) - 3 * 60 * 60 * 1000;
    return new Date(jordanUtcTimestamp).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// Return an ISO-like string with explicit +03:00 offset (Jordan local time)
export function toJordanOffsetISO(dateStr: string, timeStr: string): string {
  try {
    const dateMatch = dateStr.match(
      /([A-Za-z]+),\s+([A-Za-z]+)\s+(\d+),\s+(\d+)/
    );
    if (!dateMatch) throw new Error("Invalid date string");
    const monthStr = dateMatch[2];
    const day = parseInt(dateMatch[3], 10);
    const year = parseInt(dateMatch[4], 10);

    const monthMap: { [k: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const month = monthMap[monthStr];

    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) throw new Error("Invalid time string");
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const mer = timeMatch[3].toUpperCase();
    if (mer === "PM" && hours !== 12) hours += 12;
    if (mer === "AM" && hours === 12) hours = 0;

    const mm = (month + 1).toString().padStart(2, "0");
    const dd = day.toString().padStart(2, "0");
    const HH = hours.toString().padStart(2, "0");
    const MM = minutes.toString().padStart(2, "0");
    return `${year}-${mm}-${dd}T${HH}:${MM}:00+03:00`;
  } catch {
    return new Date().toISOString();
  }
}
