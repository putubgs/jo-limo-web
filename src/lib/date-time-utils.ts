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
  // Create dates in Jordan timezone to avoid offset issues
  const jordanDate = new Date(
    date.toLocaleString("en-US", { timeZone: "Asia/Amman" })
  );
  const year = jordanDate.getFullYear();
  const month = jordanDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  const current = new Date(startDate);

  for (let i = 0; i < 42; i++) {
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
