# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.3 - 2023-07-05

### Added

- Implemented a new `CachedFunction` class with better types and simpler code

### Deprecated

- The old `createCachedAsyncFnc()` apis is now deprecated please migrate to the CachedFunction class

## 1.0.2 - 2022-06-23

### Changed

- Remove the immutability of cache items [#3](https://github.com/y-kalka/cached-async-fnc/issues/3)

[changes](https://github.com/y-kalka/cached-async-fnc/compare/v1.0.1...v1.0.2)

## 1.0.1 - 2022-04-05

### Changed

- Update documentation
- Modifying of objects from cache are no longer mutating the cached version

### Removed

- Removed a unused config property `debugName` from config type
- Removed npm engine version from package.json

[changes](https://github.com/y-kalka/cached-async-fnc/compare/v1.0.0...v1.0.1)

## 1.0.0 - 2022-03-26
