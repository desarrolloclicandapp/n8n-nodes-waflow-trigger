import type {
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import {
	getLocationOptions,
	getSlotOptions,
	WAFLOW_BASE_URL,
} from '../shared/WaFlowApi';

const mainOutput = NodeConnectionTypes?.Main ?? 'main';

export class WaFlow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WaFloW',
		name: 'waFlow',
		icon: { light: 'file:../WaFlowTrigger/waflow.svg', dark: 'file:../WaFlowTrigger/waflow.dark.svg' },
		group: ['output'],
		version: 1,
		description: 'Send WhatsApp messages through a specific WaFloW slot',
		defaults: {
			name: 'WaFloW',
		},
		inputs: [mainOutput],
		outputs: [mainOutput],
		credentials: [
			{
				name: 'waFlowAiApi',
				required: true,
			},
		],
		properties: [
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
			{
				displayName: 'To',
				name: 'to',
				type: 'string',
				default: '',
				required: true,
				placeholder: '+595981234567',
				description: 'Destination phone number in international format',
			},
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				description: 'Plain-text WhatsApp message to send through the selected slot',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const locationId = String(this.getNodeParameter('locationId', itemIndex) ?? '').trim();
				const slotId = Number(this.getNodeParameter('slotId', itemIndex));
				const to = String(this.getNodeParameter('to', itemIndex) ?? '').trim();
				const message = String(this.getNodeParameter('message', itemIndex) ?? '').trim();

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'waFlowAiApi', {
					baseURL: WAFLOW_BASE_URL,
					url: '/agency/n8n/send-message',
					method: 'POST',
					body: {
						locationId,
						slotId,
						to,
						message,
					},
					json: true,
				});

				returnData.push({
					json: response,
					pairedItem: {
						item: itemIndex,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof Error ? error.message : 'Unknown WaFloW error',
						},
						pairedItem: {
							item: itemIndex,
						},
					});
					continue;
				}

				throw error;
			}
		}

		return [returnData];
	}
}
