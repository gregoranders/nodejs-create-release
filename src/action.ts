import * as core from '@actions/core';
import { context, GitHub } from '@actions/github';

import { Context } from '@actions/github/lib/context';

import Octokit from '@actions/github/node_modules/@octokit/rest';

type ReposCreateReleaseParams = Octokit.Octokit.ReposCreateReleaseParams;

const listReleases = async (client: GitHub, ctx: Context) => {
  const response = await client.repos.listReleases({
    owner: ctx.repo.owner,
    page: 0,
    // eslint-disable-next-line @typescript-eslint/camelcase
    per_page: 10,
    repo: ctx.repo.repo,
  });
  return response.data;
};

const findRelease = async (client: GitHub, ctx: Context, tag: string) => {
  core.startGroup(`Looking for ${tag} release`);
  const releases = await listReleases(client, ctx);
  const found = releases.reverse().find((release) => release.tag_name === tag);
  if (found) {
    core.info(`Found ${tag} release [id: ${found.id}]`);
  } else {
    core.info(`Release ${tag} not found`);
  }
  core.endGroup();
  return found;
};

const createRelease = async (client: GitHub, params: ReposCreateReleaseParams) => {
  core.startGroup(`Creating ${params.tag_name} release`);
  const response = await client.repos.createRelease(params);
  core.info(`Release ${response.data.tag_name} created [id: ${response.data.id}]`);
  core.endGroup();
  return response.data;
};

const prepareParams = (
  body: string,
  draft: boolean,
  name: string,
  prerelease: boolean,
  tag: string,
  target: string,
): ReposCreateReleaseParams => {
  return {
    body,
    draft,
    name,
    owner: context.repo.owner,
    prerelease,
    repo: context.repo.repo,
    // eslint-disable-next-line @typescript-eslint/camelcase
    tag_name: tag,
    // eslint-disable-next-line @typescript-eslint/camelcase
    target_commitish: target,
  };
};

export const run = async () => {
  const tag = core.getInput('tag', { required: true });
  const name = core.getInput('name', { required: false }) || `${tag} Release`;
  const body = core.getInput('body', { required: false }) || name;
  const draft = core.getInput('draft', { required: false }) === 'true';
  const prerelease = core.getInput('prerelease', { required: false }) === 'true';
  const target = core.getInput('target', { required: false }) || 'master';

  try {
    if (!process.env.GITHUB_TOKEN) {
      throw Error('Missing GITHUB_TOKEN');
    }

    const github = new GitHub(process.env.GITHUB_TOKEN);

    let release = await findRelease(github, context, tag);

    if (!release) {
      release = await createRelease(github, prepareParams(body, draft, name, prerelease, tag, target));
    }

    core.setOutput('id', release.id.toString());
    core.setOutput('url', release.url);
    core.setOutput('upload_url', release.upload_url);
  } catch (error) {
    core.setFailed(error);
  }
};
