# NodeJS Create Release

## [GitHub Action](https://github.com/features/actions) written in [TypeScript](http://www.typescriptlang.org/)

### Create a release on GitHub - [GitHub Action](https://github.com/features/actions)

This action finds or creates a release, so your workflow can access it.

[![Dependency Status][daviddm-image]][daviddm-url]
[![License][license-image]][license-url]
[![Issues][issues-image]][issues-url]

[![Master Build][master-build-image]][master-url] [![Master Coverage][master-coveralls-image]][master-coveralls-url] [![Master Version][master-version-image]][master-version-url]

[![Development Build][development-build-image]][development-url] [![Development Coverage][development-coveralls-image]][development-coveralls-url] [![Development Version][development-version-image]][development-version-url]

[![Code maintainability][code-maintainability-image]][code-maintainability-url] [![Code issues][code-issues-image]][code-issues-url] [![Code Technical Debt][code-tech-debt-image]][code-tech-debt-url]

[![Main Language](https://img.shields.io/github/languages/top/gregoranders/nodejs-create-release)][code-metric-url] [![Languages](https://img.shields.io/github/languages/count/gregoranders/nodejs-create-release)][code-metric-url] [![Code Size](https://img.shields.io/github/languages/code-size/gregoranders/nodejs-create-release)][code-metric-url] [![Repo-Size](https://img.shields.io/github/repo-size/gregoranders/nodejs-create-release)][code-metric-url]

## Usage
```YML
    ...
    - name: nodejs project information
      id: projectinfo
      uses: gregoranders/nodejs-project-info@v0.0.4
    - name: create release
      id: createrelease
      uses: gregoranders/nodejs-create-release@v0.0.4
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag: v${{ steps.projectinfo.outputs.version }}
        name: ${{ steps.projectinfo.outputs.name }} - ${{ steps.projectinfo.outputs.version }} Release
        target: ${{ github.ref }}
    ...
```

#### Inputs/Outputs
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

## Development

### Clone repository
```SH
git clone https://github.com/gregoranders/nodejs-create-release
```

### Install dependencies
```SH
npm install
```

### Build

```SH
npm run build
```

### Testing

#### Test using [Jest](https://jestjs.io/)
```SH
npm test
```

### Run
```SH
npm start
```

### Clear
```SH
npm run clear
```

[release-url]: https://github.com/gregoranders/nodejs-create-release/releases
[master-url]: https://github.com/gregoranders/nodejs-create-release/tree/master
[development-url]: https://github.com/gregoranders/nodejs-create-release/tree/development
[repository-url]: https://github.com/gregoranders/nodejs-create-release
[code-metric-url]: https://github.com/gregoranders/nodejs-create-release/search?l=TypeScript

[travis-url]: https://travis-ci.org/gregoranders/nodejs-create-release
[travis-image]: https://travis-ci.org/gregoranders/nodejs-create-release.svg?branch=master

[daviddm-url]: https://david-dm.org/gregoranders/nodejs-create-release
[daviddm-image]: https://david-dm.org/gregoranders/nodejs-create-release.svg?branch=master

[license-url]: https://github.com/gregoranders/nodejs-create-release/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/gregoranders/nodejs-create-release.svg

[master-version-url]: https://github.com/gregoranders/nodejs-create-release/blob/master/package.json
[master-version-image]: https://img.shields.io/github/package-json/v/gregoranders/nodejs-create-release/master

[development-version-url]: https://github.com/gregoranders/nodejs-create-release/blob/development/package.json
[development-version-image]: https://img.shields.io/github/package-json/v/gregoranders/nodejs-create-release/development

[issues-url]: https://github.com/gregoranders/nodejs-create-release/issues
[issues-image]: https://img.shields.io/github/issues-raw/gregoranders/nodejs-create-release.svg

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
