# Domino-Effect

A simple state management framework for react that relies on core triggers to cascade state to dependent system through a domino effect. In contrast to redux where all state is managed through a series of potentionally complex interactions of actions and reducers. Instead this state management framework paradigm relies on a series of core editable triggers and domninos that express the relationship between those datapoints and the overall application state.

See the storybook at [Domino Effect](https://42shadow42.github.io/domino-effect/) for examples and documentation.

## Disclaimer:
### This version of domino effect currently relies on an unreleased version of react, it has significant changes from the previous version because of those changes. Because of those changes, I would not recommend developing against this library until react's next minor or larger release ^18.3.0.

## Getting Started

Domino-Effect is simple to get started with, it's all bundled in one small package for easy installation.

```
npm install @42shadow42@domino-effect
```

Then write your first Trigger, and Domino for use in your first Domino-Effect component:

```tsx
import { domino, trigger, useDomino } from '@42shadow42/domino-effect'

const core = trigger(() => 'Hello')
const derivative = domino(({ get }) => {
	return get(core) + ' world!'
})

export const Domino = () => {
	const value = useDomino(derivative)
	return <h4 aria-label="Domino">{value}</h4>
}
```