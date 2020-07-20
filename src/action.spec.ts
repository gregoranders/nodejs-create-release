import {
  clearTestEnvironment,
  createReleaseMock,
  listReleasesMock,
  setInput,
  setOutputMock,
} from './fixtures/test-utils';

import { run as testSubject } from './action';

describe('nodejs-create-release', () => {
  beforeEach(() => {
    clearTestEnvironment();
    Reflect.deleteProperty(process.env, 'GITHUB_TOKEN');
  });

  it('should throw an Error if no tag was provided', async () => {
    return expect(testSubject()).rejects.toStrictEqual(new Error('Input required and not supplied: tag'));
  });

  it('should contain core error when GITHUB_TOKEN is missing', async () => {
    setInput('tag', 'v0.0.1');
    return expect(testSubject()).resolves.toHaveCoreError(/Missing GITHUB_TOKEN/);
  });

  it('should create a release when a valid tag and GITHUB_TOKEN are provided', async () => {
    setInput('tag', 'v0.0.1');
    process.env.GITHUB_TOKEN = 'abcd';
    listReleasesMock.mockReturnValue({ data: [] });
    createReleaseMock.mockReturnValue({
      data: {
        id: 1,
        upload_url: 'upload_url',
        url: 'url',
      },
    });
    return testSubject().then(() => {
      expect(listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: 'owner',
        page: 0,
        per_page: 10,
        repo: 'repo',
      });
      expect(createReleaseMock).toHaveBeenNthCalledWith(1, {
        body: 'v0.0.1 Release',
        draft: false,
        name: 'v0.0.1 Release',
        owner: 'owner',
        prerelease: false,
        repo: 'repo',
        tag_name: 'v0.0.1',
        target_commitish: 'master',
      });
      expect(setOutputMock).toHaveBeenCalledTimes(3);
      expect(setOutputMock).toHaveCoreOutput('id', '1');
      expect(setOutputMock).toHaveCoreOutput('url', 'url');
      expect(setOutputMock).toHaveCoreOutput('upload_url', 'upload_url');
    });
  });

  it('should return a release when a valid tag and GITHUB_TOKEN are provided and the release already exists', async () => {
    expect.assertions(6);
    setInput('tag', 'v0.0.2');
    process.env.GITHUB_TOKEN = 'abcd';
    listReleasesMock.mockReturnValue({
      data: [
        {
          id: 2,
          tag_name: 'v0.0.2',
          upload_url: 'upload_url2',
          url: 'url2',
        },
      ],
    });
    return testSubject().then(() => {
      expect(listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: 'owner',
        page: 0,
        per_page: 10,
        repo: 'repo',
      });
      expect(createReleaseMock).not.toHaveBeenCalled();
      expect(setOutputMock).toHaveBeenCalledTimes(3);
      expect(setOutputMock).toHaveCoreOutput('id', '2');
      expect(setOutputMock).toHaveCoreOutput('url', 'url2');
      expect(setOutputMock).toHaveCoreOutput('upload_url', 'upload_url2');
    });
  });

  it('should contain core error if creating a realease failed', async () => {
    setInput('tag', 'v0.0.1');
    process.env.GITHUB_TOKEN = 'abcd';
    listReleasesMock.mockReturnValue({ data: [] });
    // eslint-disable-next-line unicorn/no-useless-undefined
    createReleaseMock.mockReturnValue(undefined);
    return testSubject().then(() => {
      expect(listReleasesMock).toHaveBeenNthCalledWith(1, {
        owner: 'owner',
        page: 0,
        per_page: 10,
        repo: 'repo',
      });
      expect(createReleaseMock).toHaveCoreError(/^Unable to create/);
      expect(setOutputMock).toHaveBeenCalledTimes(0);
    });
  });
});
