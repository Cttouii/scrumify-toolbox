
import { format } from "date-fns";

export const formatDateRange = (startDate: string, endDate: string): string => {
  return `${format(new Date(startDate), "MMM d")} - ${format(new Date(endDate), "MMM d, yyyy")}`;
};
