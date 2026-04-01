import type {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

const mainOutput = NodeConnectionTypes?.Main ?? 'main';

export class WaFlowTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WaFloW Trigger',
		name: 'waFlowTrigger',
		icon: { light: 'file:waflow.svg', dark: 'file:waflow.dark.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a WaFloW webhook event occurs',
		defaults: {
			name: 'WaFloW Trigger',
		},
		inputs: [],
		outputs: [mainOutput],
		credentials: [
			{
				name: 'waFlowAiApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'WhatsApp Inbound Message',
						value: 'whatsapp inbound message',
					},
					{
						name: 'WhatsApp Outbound Message',
						value: 'whatsapp outbound message',
					},
				],
				default: 'whatsapp inbound message',
				description: 'The event that triggers the workflow',
			},
		],
		usableAsTool: true,
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		const selectedEvent = this.getNodeParameter('event') as string;

		if (bodyData.event && bodyData.event !== selectedEvent) {
			return {};
		}

		const returnData: INodeExecutionData[] = [
			{
				json: bodyData,
			},
		];

		return {
			workflowData: [returnData],
		};
	}
}
