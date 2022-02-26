# Node.JS Create Release

## [GitHub Action][github-actions-url] written in [TypeScript][typescript-url]

### Create a release on GitHub - [GitHub Action][github-actions-url]

This action finds or creates a release, so your workflow can access it.

[![License][license-image]][license-url]
[![Issues][issues-image]][issues-url]

[![Code maintainability][code-maintainability-image]][code-maintainability-url]
[![Code issues][code-issues-image]][code-issues-url]
[![Code Technical Debt][code-tech-debt-image]][code-tech-debt-url]

[![Main Language][language-image]][code-metric-url]
[![Languages][languages-image]][code-metric-url]
[![Code Size][code-size-image]][code-metric-url]
[![Repository Size][repo-size-image]][code-metric-url]

## Features

- [TypeScript][typescript-url]
- [Jest][jest-url] Unit Tests with Code Coverage
- GitHub CI Integration (feature, development, master, release)
- Code Quality via [Code Climate](./docs/codeclimate.md)

<!-- lint disable maximum-line-length -->
| GitHub                                                           | Coveralls                                                                  |                                                                              |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| [![Release Build][release-build-image]][release-url]             |                                                                            | [![Release Version][release-image]][release-url]                             |
| [![Master Build][master-build-image]][master-url]                | [![Master Coverage][master-coveralls-image]][master-coveralls-url]         | [![Master Version][master-version-image]][master-version-url]                |
| [![Development Build][development-build-image]][development-url] | [![Test Coverage][development-coveralls-image]][development-coveralls-url] | [![Development Version][development-version-image]][development-version-url] |
<!-- lint enable maximum-line-length -->
## Usage

```YML
    ...
    - name: nodejs project information
      id: projectinfo
      uses: gregoranders/nodejs-project-info@v0.0.19
    - name: create release
      id: createrelease
      uses: gregoranders/nodejs-create-release@v0.0.19
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag: v${{ steps.projectinfo.outputs.version }}
        name: ${{ steps.projectinfo.outputs.name }} - ${{ steps.projectinfo.outputs.version }} Release
        target: ${{ github.ref }}
    ...
```

### Inputs/Outputs

```YML
inputs:
  tag:
    description: 'Tag name'
    required: true
  name:
    description: 'Release name'
    required: false
    default: '${tag} Release'
  body:
    description: 'Release body'
    required: false
    default: '${name}'
  draft:
    description: '`true` for a draft, `false` to publish'
    required: false
    default: true
  prerelease:
    description: '`true` for a prerelease, `false` for a full release'
    required: false
    default: false
  target:
    description: 'Release target (branch name or commit id)'
    required: false
    default: 'master'
outputs:
  id:
    description: 'Release Id'
  url:
    description: 'Release Url'
  upload_url:
    description: 'Release Upload Url'
```

[release-url]: https://github.com/gregoranders/nodejs-create-release/releases
[master-url]: https://github.com/gregoranders/nodejs-create-release/tree/master
[development-url]: https://github.com/gregoranders/nodejs-create-release/tree/development
[code-metric-url]: https://github.com/gregoranders/nodejs-create-release/search?l=TypeScript
[license-url]: https://github.com/gregoranders/nodejs-create-release/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/gregoranders/nodejs-create-release.svg
[master-version-url]: https://github.com/gregoranders/nodejs-create-release/blob/master/package.json
[master-version-image]: https://img.shields.io/github/package-json/v/gregoranders/nodejs-create-release/master
[development-version-url]: https://github.com/gregoranders/nodejs-create-release/blob/development/package.json
[development-version-image]: https://img.shields.io/github/package-json/v/gregoranders/nodejs-create-release/development
[issues-url]: https://github.com/gregoranders/nodejs-create-release/issues
[issues-image]: https://img.shields.io/github/issues-raw/gregoranders/nodejs-create-release.svg
[release-image]: https://img.shields.io/github/release/gregoranders/nodejs-create-release
[release-build-image]: https://github.com/gregoranders/nodejs-create-release/workflows/Release%20CI/badge.svg
[master-build-image]: https://github.com/gregoranders/nodejs-create-release/workflows/Master%20CI/badge.svg
[development-build-image]: https://github.com/gregoranders/nodejs-create-release/workflows/Development%20CI/badge.svg
[master-coveralls-url]: https://coveralls.io/github/gregoranders/nodejs-create-release?branch=master
[master-coveralls-image]: https://img.shields.io/coveralls/github/gregoranders/nodejs-create-release/master
[development-coveralls-image]: https://img.shields.io/coveralls/github/gregoranders/nodejs-create-release/development
[development-coveralls-url]: https://coveralls.io/github/gregoranders/nodejs-create-release?branch=development
[code-maintainability-url]: https://codeclimate.com/github/gregoranders/nodejs-create-release/maintainability
[code-maintainability-image]: https://img.shields.io/codeclimate/maintainability/gregoranders/nodejs-create-release
[code-issues-url]: https://codeclimate.com/github/gregoranders/nodejs-create-release/maintainability
[code-issues-image]: https://img.shields.io/codeclimate/issues/gregoranders/nodejs-create-release
[code-tech-debt-url]: https://codeclimate.com/github/gregoranders/nodejs-create-release/maintainability
[code-tech-debt-image]: https://img.shields.io/codeclimate/tech-debt/gregoranders/nodejs-create-release
[language-image]: https://img.shields.io/github/languages/top/gregoranders/nodejs-create-release
[languages-image]: https://img.shields.io/github/languages/count/gregoranders/nodejs-create-release
[code-size-image]: https://img.shields.io/github/languages/code-size/gregoranders/nodejs-create-release
[repo-size-image]: https://img.shields.io/github/repo-size/gregoranders/nodejs-create-release
[typescript-url]: http://www.typescriptlang.org/
[jest-url]: https://jestjs.io/
[github-actions-url]: https://github.com/features/actions
