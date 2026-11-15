import { describe, expect, it } from "vitest";
import type { User, UserRole } from "../types/models";
import { canCreateProject, isPrivilegedRole } from "./permissions";

const userWithRole = (role: UserRole): User => ({
  _id: "690000000000000000000003",
  firstName: "Test",
  lastName: "User",
  email: "test@workspacehub.dev",
  organizationId: "690000000000000000000002",
  role,
  createdAt: "2026-11-10T09:00:00.000Z",
  updatedAt: "2026-11-10T09:00:00.000Z",
});

describe("project creation permissions", () => {
  it.each<{ role: UserRole | null; allowed: boolean }>([
    { role: "owner", allowed: true },
    { role: "admin", allowed: true },
    { role: "member", allowed: false },
    { role: null, allowed: false },
  ])("isPrivilegedRole($role) returns $allowed", ({ role, allowed }) => {
    expect(isPrivilegedRole(role)).toBe(allowed);
  });

  it.each<{ role: UserRole | null; allowed: boolean }>([
    { role: "owner", allowed: true },
    { role: "admin", allowed: true },
    { role: "member", allowed: false },
    { role: null, allowed: false },
  ])("canCreateProject for $role returns $allowed", ({ role, allowed }) => {
    expect(canCreateProject(role === null ? null : userWithRole(role))).toBe(
      allowed,
    );
  });
});
