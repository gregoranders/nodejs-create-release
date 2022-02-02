import * as core from '@actions/core';
// eslint-disable-next-line prettier/prettier
import { context, getOctokit } from '@actions/github';
// eslint-disable-next-line prettier/prettier
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types';

type Context = typeof context;
type GitHub = ReturnType<typeof getOctokit>;
type ReposCreateReleaseParameters = RestEndpointMethodTypes['repos']['createRelease']['parameters'];

const listReleases = async (client: GitHub, context_: Context) => {
  const response = await client.repos.listReleases({
    owner: context_.repo.owner,
    page: 0,
    per_page: 10,
    repo: context_.repo.repo,
  });
  return response.data;
};

const findRelease = async (client: GitHub, context_: Context, tag: string) => {
  core.startGroup(`Looking for ${tag} release`);
  const releases = await listReleases(client, context_);
  const found = releases.reverse().find((release) => release.tag_name === tag);
  if (found) {
    core.info(`Found ${tag} release [id: ${found.id}]`);
    core.endGroup();
    return { id: found.id.toString(), url: found.url, upload_url: found.upload_url };
  } else {
    core.info(`Release ${tag} not found`);
    core.endGroup();
    return;
  }
};

const createRelease = async (client: GitHub, parameters: ReposCreateReleaseParameters) => {
  core.startGroup(`Creating ${parameters.tag_name} release`);
  const response = await client.repos.createRelease(parameters);
  if (response) {
    core.info(`Release ${response.data.tag_name} created [id: ${response.data.id}]`);
    core.endGroup();
    return { id: response.data.id.toString(), url: response.data.url, upload_url: response.data.upload_url };
  } else {
    core.info(`Unable to create release ${parameters.tag_name}`);
    core.endGroup();
    return;
  }
};

const prepareParameters = (
  body: string,
  draft: boolean,
  name: string,
  prerelease: boolean,
  tag: string,
  target: string,
) => {
  return {
    body,
    draft,
    name,
    owner: context.repo.owner,
    prerelease,
    repo: context.repo.repo,
    tag_name: tag,
    target_commitish: target,
  };
};

/*eslint complexity: ["error", 8]*/
export const run = async (): Promise<void> => {
  const tag = core.getInput('tag', { required: true });
  const name = core.getInput('name', { required: false }) || `${tag} Release`;
  const body = core.getInput('body', { required: false }) || name;
  const draft = core.getInput('draft', { required: false }) === 'true';
  const prerelease = core.getInput('prerelease', { required: false }) === 'true';
  const target = core.getInput('target', { required: false }) || 'master';

  try {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('Missing GITHUB_TOKEN');
    }

    const octokit = getOctokit(process.env.GITHUB_TOKEN);

    let release = await findRelease(octokit, context, tag);

    if (!release) {
      release = await createRelease(octokit, prepareParameters(body, draft, name, prerelease, tag, target));
      if (!release) {
        throw new Error('Unable to create release');
      }
    }

    core.setOutput('id', release.id.toString());
    core.setOutput('url', release.url);
    core.setOutput('upload_url', release.upload_url);
  } catch (error: Error | any) {
    core.setFailed(error);
  }
};
