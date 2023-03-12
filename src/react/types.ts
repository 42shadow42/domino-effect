export type ReactSetDominoValue<TValue> = (
	value: TValue | ((value: TValue) => TValue),
) => void
