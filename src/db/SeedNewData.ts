import * as Boom from '@hapi/boom';

/**
 * Prevents a developer from passing in an id with the object. Useful for when creating a new object in a database where the id is generated.
 */
type INoId<T> = Omit<T, 'id'> & { id?: never };

export class Seed<T> {
	public data: INoId<T>;

	public constructor(input: INoId<T>) {
		assertNewItemHasNoId(input);
		this.data = input;
	}
}

// tslint:disable-next-line: no-any
function assertNewItemHasNoId<T extends any>(input: T): void {
	if (input.id) {
		throw Boom.badData('id can not be provided for a new object', input);
	}
}

// tslint:disable-next-line: no-any
export function confirmNewItemHasNoId<T extends any>(input: T): Seed<T> {
	if (!input.id) {
		return new Seed(input);
	}
	throw Boom.badData('id can not be provided for a new object', input);
}
