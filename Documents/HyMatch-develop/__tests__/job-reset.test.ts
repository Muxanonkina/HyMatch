import { mockJobs } from "../data/mockJobs";

// Test the job filtering logic
describe("Job Reset Logic", () => {
  test("should show all jobs when no jobs are liked or disliked", () => {
    const likedJobs: any[] = [];
    const dislikedJobs: any[] = [];

    const availableJobs = mockJobs.filter(
      (job) =>
        !likedJobs.some((likedJob) => likedJob.id === job.id) &&
        !dislikedJobs.some((dislikedJob) => dislikedJob.id === job.id)
    );

    expect(availableJobs.length).toBe(mockJobs.length);
  });

  test("should filter out liked and disliked jobs", () => {
    const likedJobs = [mockJobs[0]];
    const dislikedJobs = [mockJobs[1]];

    const availableJobs = mockJobs.filter(
      (job) =>
        !likedJobs.some((likedJob) => likedJob.id === job.id) &&
        !dislikedJobs.some((dislikedJob) => dislikedJob.id === job.id)
    );

    expect(availableJobs.length).toBe(mockJobs.length - 2);
  });

  test("should show all jobs again after reset", () => {
    let likedJobs = [mockJobs[0], mockJobs[1]];
    let dislikedJobs = [mockJobs[2]];

    // Simulate reset
    likedJobs = [];
    dislikedJobs = [];

    const availableJobs = mockJobs.filter(
      (job) =>
        !likedJobs.some((likedJob) => likedJob.id === job.id) &&
        !dislikedJobs.some((dislikedJob) => dislikedJob.id === job.id)
    );

    expect(availableJobs.length).toBe(mockJobs.length);
  });
});
