import { mockDomino } from '../domino'
import { mockTrigger } from '../trigger'
export const core = mockTrigger<string, string>()
export const derivative = mockDomino<string, string>()
