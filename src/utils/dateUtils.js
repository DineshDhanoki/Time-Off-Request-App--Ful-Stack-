// client/src/utils/dateUtils.js
import {
  format,
  parseISO,
  differenceInDays,
  isAfter,
  isBefore,
  isEqual,
} from "date-fns";

export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    return format(date, "MMM dd, yyyy h:mm a");
  } catch (error) {
    console.error("Error formatting date time:", error);
    return dateString;
  }
};

export const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  try {
    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
    return differenceInDays(end, start) + 1; // Include both start and end days
  } catch (error) {
    console.error("Error calculating duration:", error);
    return 0;
  }
};

export const isDateRangeOverlap = (
  range1Start,
  range1End,
  range2Start,
  range2End
) => {
  const start1 =
    typeof range1Start === "string" ? parseISO(range1Start) : range1Start;
  const end1 = typeof range1End === "string" ? parseISO(range1End) : range1End;
  const start2 =
    typeof range2Start === "string" ? parseISO(range2Start) : range2Start;
  const end2 = typeof range2End === "string" ? parseISO(range2End) : range2End;

  return (
    isEqual(start1, start2) ||
    isEqual(end1, end2) ||
    (isBefore(start1, end2) && isAfter(end1, start2))
  );
};
