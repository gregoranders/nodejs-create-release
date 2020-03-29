import { clearTestEnvironment, createReleaseMock, listReleasesMock, setInput, setOutputMock } from "./testUtils";

import { run as testSubject } from "./action";

describe("nodejs-create-release", () => {

  beforeEach(() => {
    clearTestEnvironment();
    Reflect.deleteProperty(process.env, "GITHUB_TOKEN");
  });

  it("no tag provided", async () => {
    return expect(testSubject()).rejects.toStrictEqual(Error("Input required and not supplied: tag"));
  });

  it("missing GITHUB_TOKEN", async () => {
    setInput("tag", "v0.0.1");
    return expect(testSubject()).resolves.toHaveCoreError(/Missing GITHUB_TOKEN/);
  });

  it("valid tag and GITHUB_TOKEN - create", async () => {
    setInput("tag", "v0.0.1");
    process.env.GITHUB_TOKEN = "abcd";
    listReleasesMock.mockReturnValue({ data: [] });
    createReleaseMock.mockReturnValue({
      data: {
        id: 1,
        upload_url: "upload_url",
        url: "url",
      },
    });
    return testSubject().then(() => {
      expect(listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: "owner",
        page: 0,
        per_page: 10,
        repo: "repo",
      });
      expect(createReleaseMock).toHaveBeenNthCalledWith(1, {
        body: "v0.0.1 Release",
        draft: false,
        name: "v0.0.1 Release",
        owner: "owner",
        prerelease: false,
        repo: "repo",
        tag_name: "v0.0.1",
        target_commitish: "master",
      });
      expect(setOutputMock).toHaveBeenCalledTimes(3);
      expect(setOutputMock).toHaveCoreOutput("id", "1");
      expect(setOutputMock).toHaveCoreOutput("url", "url");
      expect(setOutputMock).toHaveCoreOutput("upload_url", "upload_url");
    });
  });

  it("valid tag and GITHUB_TOKEN - found", async () => {
    expect.assertions(6);
    setInput("tag", "v0.0.2");
    process.env.GITHUB_TOKEN = "abcd";
    listReleasesMock.mockReturnValue({
      data: [
        {
          id: 2,
          tag_name: "v0.0.2",
          upload_url: "upload_url2",
          url: "url2",
        },
      ],
    });
    return testSubject().then(() => {
      expect(listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: "owner",
        page: 0,
        per_page: 10,
        repo: "repo",
      });
      expect(createReleaseMock).not.toHaveBeenCalled();
      expect(setOutputMock).toHaveBeenCalledTimes(3);
      expect(setOutputMock).toHaveCoreOutput("id", "2");
      expect(setOutputMock).toHaveCoreOutput("url", "url2");
      expect(setOutputMock).toHaveCoreOutput("upload_url", "upload_url2");
    });
  });

});
