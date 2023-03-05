# Domino Effect Changes

## v0.3.0

### Breaking Changes
Prior to react 18.3.0 the suspense component did not support retaining state in suspended components.
Due to the release of the use hook in 18.3.0 this limitation has been lifted, as a result the DominoSuspense component has been removed.
To migrate, you simply need convert all instances of the DominoSuspense component to use React.Suspense, convert the first child back to use your component function as a react component, and pass the props directly to the child component.

### Additional Features
Prior to react 18.3.0 it was necessary to limit domino usage to a single domino per component.
Due to the release of the use hook in 18.3.0 this limitation has been lifted, and the rules required Splitting Components or Combining Dominos no longer apply.