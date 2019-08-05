/**
 * @tsoaModel
 */
export interface IOratorCreationRequest {
	vocalRange: string;
	subjects: ISubjectCreationRequest[];
}

export interface IOratorResponse extends IOratorCreationRequest {
	id: string;
}

/**
 * @tsoaModel
 */
export interface ISubjectCreationRequest {
	id: string;
	orgId: number;
}
