import { describe, expect, it } from "vitest";
import { exampleProject, exampleTask } from "../types/modelExamples";
import { buildProjectWithTaskCount } from "./projectMetrics";

describe("buildProjectWithTaskCount", () => {
  it("returns zero when there are no tasks", () => {
    expect(buildProjectWithTaskCount(exampleProject, [])).toEqual({
      ...exampleProject,
      taskCount: 0,
    });
  });

  it("counts multiple tasks belonging to the project", () => {
    const tasks = [exampleTask, { ...exampleTask, _id: "another-task" }];
    expect(buildProjectWithTaskCount(exampleProject, tasks)).toEqual({
      ...exampleProject,
      taskCount: 2,
    });
  });

  it("excludes tasks belonging to another project", () => {
    const tasks = [
      exampleTask,
      { ...exampleTask, projectId: "another-project" },
    ];
    expect(buildProjectWithTaskCount(exampleProject, tasks).taskCount).toBe(1);
  });

  it("returns zero when every task belongs to another project", () => {
    const tasks = [{ ...exampleTask, projectId: "another-project" }];
    expect(buildProjectWithTaskCount(exampleProject, tasks).taskCount).toBe(0);
  });
});
