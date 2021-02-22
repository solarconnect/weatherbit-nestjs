![Build package](https://github.com/ordinary-yobi/weatherbit-nestjs/workflows/Build%20package/badge.svg?branch=master)

# Introduction

NestJS module 중 재사용이 필요한 npm package 로 작성하고 publish 할 수 있는 template 입니다.

# Github Packages

재사용이 가능한 NestJS modules 를 Github Packages Registry 를 사용해 관리합니다.

현재는 repository 의 visibility 와 상관없이 인증과정은 필수같습니다. 인증과정 없이 설치할 수 있는 방법이 있으면 알려주세요!

https://docs.github.com/en/packages/using-github-packages-with-your-projects-ecosystem/configuring-npm-for-use-with-github-packages

https://github.community/t/download-from-github-package-registry-without-authentication/14407  

## Configuration

### Personal access token

아래의 link 를 참조하여 github 의 personal access token 을 생성하세요.

[access token 생성하기](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token)

[access token scope 설정](https://docs.github.com/en/packages/publishing-and-managing-packages/about-github-packages#about-tokens)

발급받은 access token 을 `~/.npmrc` 파일에 아래와 같이 저장하세요. project 의 `.npmrc` 파일에 저장해도됩니다. 단 발급받은 token 을 공개된 저장소에 저장하지마세요.

```text
//npm.pkg.github.com/:_authToken=YOUR_ACCESS_TOKEN
```

# Develop

module 을 개발하는 빙법입니다.

## Create a module
 
module 을 생성할 때 는 `nest cli` 를 사용합니다.

```shell script
nest g mo sample --flat
```

`--flat` 옵션(optional) 으로 folder 를 생성하지 않고 프로젝트 구조를 단순하게 유지합니다.

그 외 `service` 등 필요한 기능을 작성하고, `module` 에 import 합니다.


## Test the module

sample 을 참고하여 테스트 코드를 작성하고, 예외처리를 해주세요.

# Build

```shell script
yarn build
```

# Publish

module 의 시작점은 `index.js`, `index.d.ts` 입니다.

자세한 내용은 `package.json` 을 참조하세요.


```shell script
yarn publish
```

# Delete

public package 의 경우 지울 수 없습니다.

https://docs.github.com/en/packages/publishing-and-managing-packages/deleting-a-package#:~:text=Deleting%20a%20version%20of%20a%20private%20package%20on%20GitHub,-To%20delete%20a&text=To%20the%20right%20of%20the,want%20to%20delete%2C%20click%20Delete.

# CI/CD

Github Actions 를 이용하여 배포합니다.

자세한 내용은 `.github/workflows/continuous-integration-workflow.yml` 파일을 참조하세요.
