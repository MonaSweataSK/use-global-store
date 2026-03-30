# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2026-03-23

### Added
- Initial release of `global-use-state`.
- Core `useGlobalState` hook using `useSyncExternalStore`.
- Imperative `getGlobalState` and `setGlobalState` helpers.
- TypeScript declaration merging for typed keys.
- React 17, 18, and 19 support.
- ESM and CJS dual build.

### Fixed
- JSDoc module name in `store.ts`.
- Optimized `useGlobalState` hook by removing redundant `useCallback`.
- Fixed `initialValue` dependency in `getServerSnapshotFn` using `useRef`.
