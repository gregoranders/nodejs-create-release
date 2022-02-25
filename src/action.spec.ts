import * as testUtils from './fixtures/test-utils';

import * as action from './action';

describe('nodejs-create-release', () => {
  beforeEach(() => {
    testUtils.clearTestEnvironment();
    Reflect.deleteProperty(process.env, 'GITHUB_TOKEN');
  });

  it('should throw an Error if no tag was provided', async () => {
    return expect(action.run()).rejects.toStrictEqual(new Error('Input required and not supplied: tag'));
  });

  it('should contain core error when GITHUB_TOKEN is missing', async () => {
    testUtils.setInput('tag', 'v0.0.1');
    return expect(action.run()).resolves.toHaveCoreError(/Missing GITHUB_TOKEN/);
  });

  it('should create a release when a valid tag and GITHUB_TOKEN are provided', async () => {
    testUtils.setInput('tag', 'v0.0.1');
    process.env.GITHUB_TOKEN = 'abcd';
    testUtils.listReleasesMock.mockReturnValue({ data: [] });
    testUtils.createReleaseMock.mockReturnValue({
      data: {
        id: 1,
        upload_url: 'upload_url',
        url: 'url',
      },
    });
    return action.run().then(() => {
      expect(testUtils.listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: 'owner',
        page: 0,
        per_page: 10,
        repo: 'repo',
      });
      expect(testUtils.createReleaseMock).toHaveBeenNthCalledWith(1, {
        body: 'v0.0.1 Release',
        draft: false,
        name: 'v0.0.1 Release',
        owner: 'owner',
        prerelease: false,
        repo: 'repo',
        tag_name: 'v0.0.1',
        target_commitish: 'master',
        generate_release_notes: true,
      });
      expect(testUtils.setOutputMock).toHaveBeenCalledTimes(3);
      expect(testUtils.setOutputMock).toHaveCoreOutput('id', '1');
      expect(testUtils.setOutputMock).toHaveCoreOutput('url', 'url');
      expect(testUtils.setOutputMock).toHaveCoreOutput('upload_url', 'upload_url');
    });
  });

  it('should return a release when a valid tag and GITHUB_TOKEN are provided and the release already exists', async () => {
    expect.assertions(6);
    testUtils.setInput('tag', 'v0.0.2');
    process.env.GITHUB_TOKEN = 'abcd';
    testUtils.listReleasesMock.mockReturnValue({
      data: [
        {
          id: 2,
          tag_name: 'v0.0.2',
          upload_url: 'upload_url2',
          url: 'url2',
        },
      ],
    });
    return action.run().then(() => {
      expect(testUtils.listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: 'owner',
        page: 0,
        per_page: 10,
        repo: 'repo',
      });
      expect(testUtils.createReleaseMock).not.toHaveBeenCalled();
      expect(testUtils.setOutputMock).toHaveBeenCalledTimes(3);
      expect(testUtils.setOutputMock).toHaveCoreOutput('id', '2');
      expect(testUtils.setOutputMock).toHaveCoreOutput('url', 'url2');
      expect(testUtils.setOutputMock).toHaveCoreOutput('upload_url', 'upload_url2');
    });
  });

  it('should contain core error if creating a realease failed', async () => {
    testUtils.setInput('tag', 'v0.0.1');
    process.env.GITHUB_TOKEN = 'abcd';
    testUtils.listReleasesMock.mockReturnValue({ data: [] });
    // eslint-disable-next-line unicorn/no-useless-undefined
    testUtils.createReleaseMock.mockReturnValue(undefined);
    return action.run().then(() => {
      expect(testUtils.listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: 'owner',
        page: 0,
        per_page: 10,
        repo: 'repo',
      });
      expect(testUtils.createReleaseMock).toHaveCoreError(/^Unable to create/);
      expect(testUtils.setOutputMock).toHaveBeenCalledTimes(0);
    });
  });
});
