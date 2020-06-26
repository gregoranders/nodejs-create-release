import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { RestEndpointMethodTypes } from '@octokit/plugin-rest-endpoint-methods/dist-types';

type Context = typeof context;
type GitHub = ReturnType<typeof getOctokit>;
type ReposCreateReleaseParams = RestEndpointMethodTypes['repos']['createRelease']['parameters'];

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
  } else {
    core.info(`Release ${tag} not found`);
  }
  core.endGroup();
  return found;
};

const createRelease = async (client: GitHub, parameters: ReposCreateReleaseParams) => {
  core.startGroup(`Creating ${parameters.tag_name} release`);
  const response = await client.repos.createRelease(parameters);
  if (response) {
    core.info(`Release ${response.data.tag_name} created [id: ${response.data.id}]`);
    core.endGroup();
    return response.data;
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

    const release = await findRelease(octokit, context, tag);

    if (release) {
      core.setOutput('id', release.id.toString());
      core.setOutput('url', release.url);
      core.setOutput('upload_url', release.upload_url);
    } else {
      const newRelease = await createRelease(octokit, prepareParameters(body, draft, name, prerelease, tag, target));
      if (newRelease) {
        core.setOutput('id', newRelease.id.toString());
        core.setOutput('url', newRelease.url);
        core.setOutput('upload_url', newRelease.upload_url);
      } else {
        throw new Error('Unable to create release');
      }
    }
  } catch (error) {
    core.setFailed(error);
  }
};
