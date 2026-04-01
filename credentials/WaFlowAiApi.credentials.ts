import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';
import { WAFLOW_BASE_URL } from '../nodes/shared/WaFlowApi';

export class WaFlowAiApi implements ICredentialType {
	name = 'waFlowAiApi';

	displayName = 'WaFloW.ai API';

	documentationUrl = 'https://waflow.ai';

	icon: Icon = {
		light: 'file:../nodes/WaFlowTrigger/waflow.svg',
		dark: 'file:../nodes/WaFlowTrigger/waflow.dark.svg',
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'hidden',
			default: WAFLOW_BASE_URL,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/agency/api-keys',
			method: 'GET',
		},
	};
}
