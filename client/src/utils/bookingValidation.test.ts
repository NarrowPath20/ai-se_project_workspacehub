import { describe, expect, it } from "vitest";
import {
  validateBookingFormState,
  type BookingFormState,
} from "./bookingValidation";

const validForm: BookingFormState = {
  title: "Team planning",
  description: "",
  startsAt: "2026-11-20T10:00:00.000Z",
  endsAt: "2026-11-20T11:00:00.000Z",
};

describe("validateBookingFormState", () => {
  it("returns an empty error map for valid input", () => {
    expect(validateBookingFormState(validForm)).toEqual({});
  });

  it("accepts a title with exactly two characters", () => {
    expect(validateBookingFormState({ ...validForm, title: "OK" })).toEqual({});
  });

  it.each(["", "   "])("requires a nonblank title (%j)", (title) => {
    expect(validateBookingFormState({ ...validForm, title })).toEqual({
      title: "Title is required.",
    });
  });

  it.each(["x", " x "])(
    "rejects a title shorter than two trimmed characters (%j)",
    (title) => {
      expect(validateBookingFormState({ ...validForm, title })).toEqual({
        title: "Title must be at least 2 characters.",
      });
    },
  );

  it("requires a start time", () => {
    expect(validateBookingFormState({ ...validForm, startsAt: "" })).toEqual({
      startsAt: "Start time is required.",
    });
  });

  it("requires an end time", () => {
    expect(validateBookingFormState({ ...validForm, endsAt: "" })).toEqual({
      endsAt: "End time is required.",
    });
  });

  it("reports all required fields when the form is empty", () => {
    expect(
      validateBookingFormState({
        title: "",
        description: "",
        startsAt: "",
        endsAt: "",
      }),
    ).toEqual({
      title: "Title is required.",
      startsAt: "Start time is required.",
      endsAt: "End time is required.",
    });
  });

  it("rejects an invalid start date string", () => {
    expect(
      validateBookingFormState({ ...validForm, startsAt: "not-a-date" }),
    ).toEqual({
      startsAt: "Start time must be a valid date.",
    });
  });

  it("rejects an invalid end date string", () => {
    expect(
      validateBookingFormState({ ...validForm, endsAt: "not-a-date" }),
    ).toEqual({
      endsAt: "End time must be a valid date.",
    });
  });

  it("rejects an end time before the start time", () => {
    expect(
      validateBookingFormState({
        ...validForm,
        endsAt: "2026-11-20T09:00:00.000Z",
      }),
    ).toEqual({
      endsAt: "End time must be after the start time.",
    });
  });

  it("rejects an end time exactly equal to the start time", () => {
    expect(
      validateBookingFormState({ ...validForm, endsAt: validForm.startsAt }),
    ).toEqual({
      endsAt: "End time must be after the start time.",
    });
  });
});
