import type {
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import {
	getLocationOptions,
	getSlotOptions,
	normalizeSlotId,
} from '../shared/WaFlowApi';

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
			{
				displayName: 'Account Name or ID',
				name: 'locationId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getLocations',
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
			{
				displayName: 'Slot Name or ID',
				name: 'slotId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSlots',
				},
				default: '',
				required: true,
				description:
					'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
			},
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			async getLocations(this: ILoadOptionsFunctions) {
				return await getLocationOptions.call(this);
			},
			async getSlots(this: ILoadOptionsFunctions) {
				return await getSlotOptions.call(this);
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData() as IDataObject;
		const selectedEvent = this.getNodeParameter('event') as string;
		const selectedLocationId = String(this.getNodeParameter('locationId') ?? '').trim();
		const selectedSlotId = normalizeSlotId(this.getNodeParameter('slotId'));
		const payloadLocationId = String(bodyData.locationId ?? '').trim();
		const payloadSlot = bodyData.slot as IDataObject | undefined;
		const payloadSlotId = normalizeSlotId(payloadSlot?.id ?? bodyData.slotId);

		if (bodyData.event && bodyData.event !== selectedEvent) {
			return {};
		}

		if (selectedLocationId && payloadLocationId !== selectedLocationId) {
			return {};
		}

		if (selectedSlotId && payloadSlotId !== selectedSlotId) {
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
