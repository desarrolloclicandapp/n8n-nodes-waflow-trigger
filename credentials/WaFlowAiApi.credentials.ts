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
			displayName: 'Agency ID / Location ID',
			name: 'subaccountId',
			type: 'string',
			default: '',
			required: true,
			description: 'Use your WaFloW Agency ID from the dashboard.',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: WAFLOW_BASE_URL,
			placeholder: WAFLOW_BASE_URL,
			required: true,
			description: 'Production is the default. Override this only when you need to point the node to a staging or test WaFloW backend.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				'X-Subaccount-Id': '={{$credentials.subaccountId}}',
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
