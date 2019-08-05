import { IOratorCreationRequest, ISubjectCreationRequest, IOratorResponse } from './oratorSwaggerModels';
import { DbOrator } from '../../db/entities/DbOrator';
import { confirmNewItemHasNoId } from '../../db/SeedNewData';
import * as Boom from '@hapi/boom';
import { Connection } from 'typeorm';
import { DbSubjectOfIDM } from '../../db/entities/DbSubjectOfIDM';

export const assertOratorValidity = (oratorToValidate: IOratorCreationRequest): void => {
	if (oratorToValidate.subjects.length === 0) {
		throw Boom.badRequest('You must include at least one subject');
	}
	oratorToValidate.subjects.forEach(assertSubjectValidity);
};

export const assertSubjectValidity = (subjectToValidate: ISubjectCreationRequest): void => {
	if (subjectToValidate.orgId === 0) {
		throw Boom.badRequest('0 is not a valid orgId');
	}
};

export const saveNewOratorToDb = async (
	newOrator: IOratorCreationRequest,
	connection: Connection,
): Promise<IOratorResponse> => {
	assertOratorValidity(newOrator);

	const oratorModel = DbOrator.make(confirmNewItemHasNoId(newOrator));

	const subjectModels = newOrator.subjects.map(aSubject => {
		return DbSubjectOfIDM.make({
			id: aSubject.id,
			orgId: aSubject.orgId,
			orator: oratorModel,
		});
	});

	await connection.manager.transaction(async transactionalEntityManager => {
		await transactionalEntityManager.save(oratorModel);
		await transactionalEntityManager.save(subjectModels);
	});

	return {
		id: oratorModel.id,
		vocalRange: oratorModel.vocalRange,
		subjects: subjectModels,
	};
};

export const getOratorBySubject = async (
	subject: { id: string; orgId: number },
	connection: Connection,
): Promise<IOratorResponse> => {
	const queriedSubjects = await connection.getRepository(DbSubjectOfIDM).find({
		where: {
			id: subject.id,
			orgId: subject.orgId,
		},
	});

	if (queriedSubjects.length < 1) {
		throw Boom.notFound(`Could not find any orators with this information`, subject);
	}
	const oratorIds = queriedSubjects.map(sub => sub.orator.id);
	if (oratorIds.length > 1) {
		throw Boom.internal(
			'Our many-to-one constraint must have failed because we got more than one orator for this information',
			subject,
		);
	}
	const oratorId = queriedSubjects[0].orator.id;

	const desiredOrator = await connection.getRepository(DbOrator).findOne({
		where: {
			id: oratorId,
		},
	});

	if (!desiredOrator) {
		throw Boom.notFound(`Could not find a orator by id ${oratorId}`);
	}

	const allSubjectsOfOrator = await connection.getRepository(DbSubjectOfIDM).find({
		where: {
			orator: {
				id: oratorId,
			},
		},
	});

	const combined: IOratorResponse = {
		id: desiredOrator.id,
		vocalRange: desiredOrator.vocalRange,
		subjects: allSubjectsOfOrator,
	};

	return combined;
};
