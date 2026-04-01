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
			description: 'Use your WaFloW Agency ID from the dashboard. The official node uses the production API automatically.',
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
			baseURL: WAFLOW_BASE_URL,
			url: '/agency/api-keys',
			method: 'GET',
		},
	};
}
