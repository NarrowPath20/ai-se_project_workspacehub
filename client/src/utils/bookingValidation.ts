export interface BookingFormState {
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormState, string>>;

export const validateBookingFormState = (
  formState: BookingFormState,
): BookingFormErrors => {
  const errors: BookingFormErrors = {};
  if (typeof formState.title !== "string" || !formState.title.trim()) {
    errors.title = "Title is required.";
  } else if (formState.title.trim().length < 2) {
    errors.title = "Title must be at least 2 characters.";
  }
  const startsAt = new Date(formState.startsAt).getTime();
  const endsAt = new Date(formState.endsAt).getTime();
  if (!formState.startsAt) {
    errors.startsAt = "Start time is required.";
  } else if (Number.isNaN(startsAt)) {
    errors.startsAt = "Start time must be a valid date.";
  }
  if (!formState.endsAt) {
    errors.endsAt = "End time is required.";
  } else if (Number.isNaN(endsAt)) {
    errors.endsAt = "End time must be a valid date.";
  }
  if (!errors.startsAt && !errors.endsAt && endsAt <= startsAt) {
    errors.endsAt = "End time must be after the start time.";
  }
  return errors;
};
