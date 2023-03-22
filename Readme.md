# Domino-Effect

A simple state management framework for react that relies on core triggers to cascade state to dependent system through a domino effect. In contrast to redux where all state is managed through a series of potentionally complex interactions of actions and reducers. Instead this state management framework paradigm relies on a series of core editable triggers and dominos that express the relationship between those datapoints and the overall application state.

To illustrate the distinction take the example of a making a purchase from an e-commerce site. You might have the following actions:

- ADD_TO_CART
- REMOVE_FROM_CART
- EMPTY_CART

It seems simple really, until you start to consider the data derived from these modified data points. In the [shopping cart](https://codesandbox.io/s/github/reduxjs/redux/tree/master/examples/shopping-cart) example from redux. They make it sound simple by just implemented cart totals as a selector off the products, but in my experience the real world is not so simple. Here are a few real life examples that make this simplified example less ideal.

1. The pricing of the product is variable based on location or requested quantity, and as a result it is calculated on the server.
2. The shopping cart total has a variable tax based on location or user profile, as a result it is calculated on the server.
3. The shopping cart has a discount applied based on user profile, and as a result is calculated on the server.

By now you probably get where I'm going. Redux breaks down when calculations cannot be performed on the client. You might find yourself working around this by creating compound actions like: 

- ADD_TO_CART_AND_RECALCULATE
- REMOVE_FROM_CART_AND_RECALCULATE

This can easily spiral out of control and make complicated workflows of actions to handle business rules and processes.

In contrast the "Domino Effect" paradigm asserts that there is core data that can be modified by every user action, and that every other piece of data is a calculation of the core data. In the above example the core pieces of data are the items in the shopping cart, the user, the purchase location, etc. and the calculated data is the subtotal, tax, and final total. Domino Effect seeks to make it easy to grasp and manage the relationship between these values, rather than the complex processes that orchestrate their synchronization across the application lifecycle.

See the storybook at [Domino Effect](https://42shadow42.github.io/domino-effect/) for examples and documentation.

## Disclaimer:
### This version of domino effect currently relies on an unreleased version of react, it has significant changes from the previous version because of those changes. Because of those changes, I would not recommend developing with this library until react's next minor or larger release ^18.3.0.

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
	const [value] = useDomino(derivative)
	return <h4 aria-label="Domino">{value}</h4>
}
```