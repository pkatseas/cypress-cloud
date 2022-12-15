import nock from "nock";
import {
  createRun,
  createInstance,
  setInstanceTests,
  updateInstanceResults,
  updateInstanceStdout,
} from "../../cloud/api";
import { CreateRunPayload, CreateRunResponse } from "../../cloud/types/run";
import {
  SetInstanceTestsPayload,
  UpdateInstanceResultsPayload,
  UpdateInstanceResultsResponse,
} from "../../cloud/types/instance";
import _ from "lodash";
import {
  CreateInstancePayload,
  CreateInstanceResponse,
} from "../../cloud/types/instance";
import { TestState } from "../../cloud/types/test";

const API_BASEURL = "http://localhost:1234";

describe("cloud/api", () => {
  beforeAll(() => {
    process.env.CURRENTS_API_BASE_URL = API_BASEURL;
  });

  describe("createRun", () => {
    let payload: CreateRunPayload;

    beforeEach(() => {
      payload = {
        ci: {
          params: { foo: "bar" },
          provider: null,
        },
        ciBuildId: "ci-build-id",
        projectId: "project-1",
        recordKey: "token-1",
        commit: {
          sha: "sha",
          branch: "main",
          authorName: "john",
          authorEmail: "john@currents.dev",
          message: "msg",
          remoteOrigin: "https://github.com/foo/bar.git",
        },
        specs: ["foo.js", "bar.js"],
        group: "group-1",
        platform: {
          osName: "linux",
          osVersion: "Debian - 10.5",
          browserName: "chrome",
          browserVersion: "6.4.7",
        },
        parallel: true,
        specPattern: [],
        tags: [],
        testingType: "e2e",
      };
    });

    it("POST /runs + returns CreateRunResponse", async () => {
      const result: CreateRunResponse = {
        warnings: [],
        groupId: "groupId1",
        machineId: "machineId1",
        runId: "runId1",
        runUrl: "runUrl1",
        isNewRun: true,
      };

      nock(API_BASEURL).post("/runs", _.matches(payload)).reply(200, result);

      const run = await createRun(payload);
      expect(run).toStrictEqual(result);
    });
  });

  describe("createInstance", () => {
    let payload: CreateInstancePayload;

    beforeEach(() => {
      payload = {
        runId: "1",
        groupId: "groupId1",
        machineId: "machineId1",
        platform: {
          osName: "linux",
          osVersion: "Debian - 10.5",
          browserName: "chrome",
          browserVersion: "6.4.7",
        },
      };
    });

    it("POST /runs/:id/instances + returns CreateInstanceResponse", async () => {
      const result: CreateInstanceResponse = {
        spec: null,
        instanceId: null,
        claimedInstances: 10,
        totalInstances: 10,
      };

      nock(API_BASEURL)
        .post("/runs/1/instances", _.matches(payload))
        .reply(200, result);

      const run = await createInstance(payload);
      expect(run).toStrictEqual(result);
    });
  });

  describe("setInstanceTests", () => {
    let payload: SetInstanceTestsPayload;

    beforeEach(() => {
      payload = {
        config: {
          video: false,
          videoUploadOnPasses: false,
        },
        tests: [],
        hooks: [],
      };
    });

    it("POST /instances/:id/tests", async () => {
      const result = {};

      nock(API_BASEURL)
        .post("/instances/1/tests", _.matches(payload))
        .reply(200, result);

      const run = await setInstanceTests("1", payload);
      expect(run).toStrictEqual(result);
    });
  });

  describe("updateInstanceResults", () => {
    let payload: UpdateInstanceResultsPayload;

    beforeEach(() => {
      payload = {
        stats: {
          suites: 1,
          tests: 2,
          passes: 1,
          pending: 1,
          skipped: 0,
          failures: 0,
          wallClockStartedAt: "2022-12-11T08:46:31.881Z",
          wallClockEndedAt: "2022-12-11T08:46:50.519Z",
          wallClockDuration: 18638,
        },
        tests: [
          {
            clientId: "r3",
            state: TestState.Pending,
            displayError: null,
            attempts: [
              {
                state: TestState.Pending,
                error: null,
                wallClockStartedAt: null,
                wallClockDuration: null,
                videoTimestamp: null,
              },
            ],
          },
          {
            clientId: "r4",
            state: TestState.Passed,
            displayError: null,
            attempts: [
              {
                state: TestState.Passed,
                error: null,
                wallClockStartedAt: "2022-12-11T08:46:31.893Z",
                wallClockDuration: 18625,
                videoTimestamp: 1172,
              },
            ],
          },
        ],
        exception: null,
        video: false,
        screenshots: [],
        reporterStats: {
          suites: 1,
          tests: 1,
          passes: 1,
          pending: 1,
          failures: 0,
          start: "2022-12-11T08:46:31.884Z",
          end: "2022-12-11T08:46:50.535Z",
          duration: 18651,
        },
      };
    });

    it("POST /instances/:id/results + returning UpdateInstanceResultsResponse", async () => {
      const result: UpdateInstanceResultsResponse = {
        screenshotUploadUrls: [],
        videoUploadUrl: null,
      };

      nock(API_BASEURL)
        .post("/instances/1/results", _.matches(payload))
        .reply(200, result);

      const run = await updateInstanceResults("1", payload);
      expect(run).toStrictEqual(result);
    });
  });

  describe("updateInstanceStdout", () => {
    const payload = "string";

    it("PUT /instances/:id/stdout", async () => {
      nock(API_BASEURL)
        .put("/instances/1/stdout", { stdout: payload })
        .reply(200);

      const run = await updateInstanceStdout("1", payload);
      expect(run).toMatchObject({ status: 200 });
    });
  });

  afterAll(() => {
    nock.restore();
  });
});
