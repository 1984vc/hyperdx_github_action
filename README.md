# Track GitHub Actions in HyperDX (Opentelemetry)
[![Build Status](https://github.com/1984vc/hyperdx_github_action/actions/workflows/test.yml/badge.svg)](https://github.com/1984vc/hyperdx_github_action/actions/workflows/test.yml)

Example: 

```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: |
          npm ci
      - run: |
          npm run all
      - run: npm test
  inception:
    runs-on: ubuntu-latest
    needs: build-and-test # wait until build-and-test in done
    steps:
      - uses: actions/checkout@v3
      - uses: mdp/hyperdx_github_action
        with:
          hyperdx_endpoint: ${{ secrets.HYPERDX_ENDPOINT }}
          hyperdx_service_name: MyGitHubAction
          hyperdx_key: ${{ secrets.HYPERDX_API_KEY }}
          github_token: ${{ secrets.GITHUB_TOKEN }} # You don't need to set this in Secrets as it's included by default in workflows
```
=======

## What to expect
![Screenshot Tracing](https://github.com/1984vc/hyperdx_github_action/blob/main/.github/assets/capture.png?raw=true)
![Screenshot Logging](https://github.com/1984vc/hyperdx_github_action/blob/main/.github/assets/logging.png?raw=true)
