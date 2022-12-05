# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.5.1](https://github.com/tim-smart/dfx/compare/dfx@0.5.0...dfx@0.5.1) (2022-12-05)


### Bug Fixes

* tighten response constraint on guild commands ([a8b5647](https://github.com/tim-smart/dfx/commit/a8b56471b5ce7bf3ef44b0312ed5e53b62f4cfa0))





# [0.5.0](https://github.com/tim-smart/dfx/compare/dfx@0.3.1...dfx@0.5.0) (2022-12-05)


### Bug Fixes

* example ([39f2fad](https://github.com/tim-smart/dfx/commit/39f2fad1b2db438f0776634ba78dd05cbe851a4e))
* rest rate limit multiplier and params ([68e934a](https://github.com/tim-smart/dfx/commit/68e934ab50616046c7c76a90c32851841ed84ff8))
* run shard effects in parallel ([3bbdbc7](https://github.com/tim-smart/dfx/commit/3bbdbc77999d067a6e1d62f3c9ed98768902ad64))


### Features

* Add basic Interactions ([e227fbe](https://github.com/tim-smart/dfx/commit/e227fbef77e6221e26db92ced436ef4eebc88d05))
* add Sharder ([50e313d](https://github.com/tim-smart/dfx/commit/50e313dd40333f1e28fde56970d0fb5c953d4889))
* add webhook support to interactions ([9aae267](https://github.com/tim-smart/dfx/commit/9aae26794800ea143177610a183635531c669191))
* add WS service ([85a7e8f](https://github.com/tim-smart/dfx/commit/85a7e8f2126349e417f5f573077aca9ba2dd04df))
* DiscordGateway service ([c78a016](https://github.com/tim-smart/dfx/commit/c78a01615682dff761ba14f9acd9644c97230799))
* error support for InteractionBuilder ([3747f96](https://github.com/tim-smart/dfx/commit/3747f9621e0b1efdbfa4e5f74cea5d0a40e0af6d))
* helpers and more interactions functionality ([af17d60](https://github.com/tim-smart/dfx/commit/af17d6053ab9275fe965d15d27ce7ba0914e2a9c))
* implement shard ([4509357](https://github.com/tim-smart/dfx/commit/45093577184e061a7d88eef9f30e81ef96c9afee))
* implement sharder ([d7cd60e](https://github.com/tim-smart/dfx/commit/d7cd60e04bde8e5ce01e5e9088d586c08fd14035))
* more interactions helpers ([fc028f5](https://github.com/tim-smart/dfx/commit/fc028f5edf260c482d0f810da9d68b099a0d5fcd))
* RateLimitStore ([81e138b](https://github.com/tim-smart/dfx/commit/81e138b381348e9a43a9897ab9400bd3e5a2f47a))
* ShardStore ([5b24301](https://github.com/tim-smart/dfx/commit/5b24301a3785d4b299e74a2d69e3ea1a82f35d73))





## [0.3.1](https://github.com/tim-smart/dfx/compare/dfx@0.3.0...dfx@0.3.1) (2022-03-23)

**Note:** Version bump only for package dfx





# [0.3.0](https://github.com/tim-smart/dfx/compare/dfx@0.2.0...dfx@0.3.0) (2022-03-22)


### Code Refactoring

* simplify rest DX ([de57d33](https://github.com/tim-smart/dfx/commit/de57d3399af0d4f0bbbed7830156d85d45363669))


### BREAKING CHANGES

* rest api changed





# [0.2.0](https://github.com/tim-smart/dfx/compare/dfx@0.1.0...dfx@0.2.0) (2022-03-22)


### Bug Fixes

* **DiscordWS:** error type should be never after retry ([d0b9d7e](https://github.com/tim-smart/dfx/commit/d0b9d7e9748da874eab79fc77964d5f89fd5b3c5))


### Features

* callRest helper ([5c617b6](https://github.com/tim-smart/dfx/commit/5c617b60a967ca8972e00e29e5246c4ca3c45fa4))





# 0.1.0 (2022-03-22)


### Code Refactoring

* move callbag-effect-ts to peerDependencies ([1c4283a](https://github.com/tim-smart/dfx/commit/1c4283a9cda7879fcc234696bbd3132a21d4eb4f))


### Features

* DiscordGateway service ([4dcef83](https://github.com/tim-smart/dfx/commit/4dcef8308a8e3715b8a856d74623b087efe49249))
* DiscordREST implementation ([fc4ee3d](https://github.com/tim-smart/dfx/commit/fc4ee3dd8102fe6f30f1aac04de45bb727ebea3b))
* DiscordWSService ([208203b](https://github.com/tim-smart/dfx/commit/208203b88e11a38c43eae1ad8b0ecc5ee82fe9b2))
* LiveLogDebug layer ([a1ade42](https://github.com/tim-smart/dfx/commit/a1ade427a0e9f265d627dc1c2e91e6cf2915d328))
* **rest:** progress ([32ecc45](https://github.com/tim-smart/dfx/commit/32ecc458c70139feb4bf4a93776da975a50850d4))


### BREAKING CHANGES

* callbag-effect-ts is a required peer dependency
