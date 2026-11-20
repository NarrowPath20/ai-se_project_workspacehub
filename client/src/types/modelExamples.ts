import type { Project, ProjectWithTaskCount, Task } from "./models";
import { buildProjectWithTaskCount } from "../utils/projectMetrics";

export const exampleProject: Project = {
  _id: "690000000000000000000001",
  organizationId: "690000000000000000000002",
  name: "Platform Refresh",
  description: "Improve navigation and project visibility in the dashboard.",
  createdBy: "690000000000000000000003",
  createdAt: "2026-11-10T09:00:00.000Z",
  updatedAt: "2026-11-12T14:30:00.000Z",
};

export const exampleTask: Task = {
  _id: "690000000000000000000004",
  organizationId: exampleProject.organizationId,
  projectId: exampleProject._id,
  title: "Review project navigation",
  description: "Document improvements to the Projects page navigation.",
  status: "in_progress",
  priority: "medium",
  assignedTo: exampleProject.createdBy,
  dueDate: "2026-11-20T17:00:00.000Z",
  createdAt: "2026-11-11T10:00:00.000Z",
  updatedAt: "2026-11-13T15:00:00.000Z",
};

export const exampleProjectWithTaskCount: ProjectWithTaskCount =
  buildProjectWithTaskCount(exampleProject, [exampleTask]);
