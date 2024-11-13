import { ValidationErrors } from "@angular/forms";

export function validateEndDateBeforeStartDate(startDate: Date | null, endDate: Date | null): ValidationErrors | null {
  if (!endDate || !startDate) {
    return null;
  }
  if (endDate < startDate) {
    return { endDateBeforeStartDate: true };
  }
  return null;
}
