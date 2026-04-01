import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';

export const WAFLOW_BASE_URL = 'https://wa.waflow.ai';

interface WaFlowSlotCatalogEntry extends IDataObject {
	slotId?: number | null;
	slotName?: string | null;
	phoneNumber?: string | null;
	label?: string | null;
}

interface WaFlowAccountCatalog extends IDataObject {
	locationId?: string | null;
	name?: string | null;
	label?: string | null;
	slots?: WaFlowSlotCatalogEntry[];
}

interface WaFlowSlotCatalogResponse extends IDataObject {
	accounts?: WaFlowAccountCatalog[];
}

type WaFlowRequestContext = ILoadOptionsFunctions | IExecuteFunctions;

export function normalizeSlotId(value: unknown): number | null {
	const parsed = Number.parseInt(String(value ?? ''), 10);
	return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

async function requestCatalog(
	this: WaFlowRequestContext,
	locationId?: string,
): Promise<WaFlowSlotCatalogResponse> {
	const requestOptions: IHttpRequestOptions = {
		baseURL: WAFLOW_BASE_URL,
		url: '/agency/n8n/slot-catalog',
		method: 'GET',
		json: true,
	};

	if (locationId) {
		requestOptions.qs = {
			locationId,
		};
	}

	return await this.helpers.httpRequestWithAuthentication.call(
		this,
		'waFlowAiApi',
		requestOptions,
	);
}

export async function getLocationOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const response = await requestCatalog.call(this);
	const accounts = Array.isArray(response?.accounts) ? response.accounts : [];
	const options: INodePropertyOptions[] = [];

	for (const account of accounts) {
		const locationId = String(account.locationId ?? '').trim();
		if (!locationId) {
			continue;
		}

		const label = String(account.label ?? '').trim()
			|| String(account.name ?? '').trim()
			|| locationId;

		options.push({
			name: label,
			value: locationId,
		});
	}

	return options;
}

export async function getSlotOptions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	const locationId = String(this.getCurrentNodeParameter('locationId') ?? '').trim();
	if (!locationId) {
		return [];
	}

	const response = await requestCatalog.call(this, locationId);
	const accounts = Array.isArray(response?.accounts) ? response.accounts : [];
	const account = accounts.find(
		(candidate) => String(candidate.locationId ?? '').trim() === locationId,
	);

	if (!account || !Array.isArray(account.slots)) {
		return [];
	}

	const options: INodePropertyOptions[] = [];

	for (const slot of account.slots) {
		const slotId = normalizeSlotId(slot.slotId);
		if (!slotId) {
			continue;
		}

		const label = String(slot.label ?? '').trim()
			|| String(slot.slotName ?? '').trim()
			|| `Slot ${slotId}`;

		options.push({
			name: label,
			value: slotId,
		});
	}

	return options;
}
