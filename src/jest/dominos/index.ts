import { domino, trigger } from '../../dominos'
export const core = trigger<string, string>(() => 'N/A')
export const derivative = domino<string, string>(() => 'N/A')