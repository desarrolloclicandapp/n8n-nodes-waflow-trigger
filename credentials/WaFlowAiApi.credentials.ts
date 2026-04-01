import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

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
			description: 'The agency or location identifier used by your WaFloW backend',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.waflow.ai',
			placeholder: 'https://api.waflow.ai',
			description: 'The base URL of your WaFloW.ai installation',
			required: true,
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
