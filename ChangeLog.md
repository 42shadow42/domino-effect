# Domino Effect Changes

## v0.4.0

### Breaking Changes
In order to support refreshing of Dominos it was necessary to change the return format from useDomino and useAsyncDomino to return a tuple instead of the raw value. This has no visual impact when the value is just used as a react node and rendered, but will cause a console error to be reported because of the refresh callback. It will absolutely cause errors when trying to use the value in the body of the react component.

### Additional Features
This release brings the ability to refresh Dominos. With regards of the onDelete callback, refreshing Dominos are treated as deleted. This is to ensure cleanup possibilities for soon to be orphaned resources. The difference is the value is automatically recalculated and subscribers are notified of the new value.

## v0.3.2

### Minor Changes

Updated documentation

Fixed bug where context was not forwarded correctly in all places

Fixed limitation where domino values could not be functions

## v0.3.1

### Minor Changes

Optimized bundle size!

## v0.3.0

### Breaking Changes
Prior to react 18.3.0 the suspense component did not support retaining state in suspended components.
Due to the release of the use hook in 18.3.0 this limitation has been lifted, as a result the DominoSuspense component has been removed.
To migrate, you simply need convert all instances of the DominoSuspense component to use React.Suspense, convert the first child back to use your component function as a react component, and pass the props directly to the child component.

### Additional Features
Prior to react 18.3.0 it was necessary to limit domino usage to a single domino per component.
Due to the release of the use hook in 18.3.0 this limitation has been lifted, and the rules required Splitting Components or Combining Dominos no longer apply.

Added onDelete option to Dominos to allow cleaning up of cached resources (ex. Web Sockets).