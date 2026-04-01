# n8n-nodes-waflow-trigger

This is an n8n community node package for [WaFloW.ai](https://waflow.ai).

WaFloW is a platform for automating WhatsApp communications. This package provides:

* **WaFloW Trigger**: Receives inbound or outbound webhook events from WaFloW.
* **WaFloW Sender**: Sends a WhatsApp message through a specific WaFloW slot.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-waflow-trigger`.

For self-hosted manual installs, follow the official guide and install the package inside your n8n custom nodes directory.

## Operations

### WaFloW Trigger

Use this trigger when you want a workflow to start only for:

* a specific **event** (`Inbound` or `Outbound`)
* a specific **WaFloW account**
* a specific **slot / number**

### WaFloW Sender

Use this action node to send a plain-text WhatsApp message through a selected WaFloW slot.

## Credentials

You can use these credentials to authenticate with the WaFloW API.

### WaFloW.ai API

To configure the node, you will need the following information from your WaFloW account:

1. **API Key**: Your personal authentication key.
2. **Agency ID / Location ID**: Your WaFloW agency identifier from the dashboard.
3. **Base URL**: Defaults to `https://wa.waflow.ai`. Override it only when testing against a staging or development WaFloW backend.

## Compatibility

* Built as a standard n8n community node package.
* Includes compatibility for n8n instances that still expect trigger outputs as `'main'`.
* For n8n Cloud availability, the package must still pass n8n's verification process.

## Usage

### Trigger

1. Add the **WaFloW Trigger** node to your workflow.
2. Select or create your **WaFloW.ai API** credentials.
3. Choose the **Event**, **Account**, and **Slot**.
4. Copy the production or test webhook URL that n8n generates for the trigger.
5. Register that URL in your WaFloW backend or dashboard for the same event.
6. Activate the workflow and send a matching event from WaFloW.

### Action

1. Add the **WaFloW Sender** node after any trigger or previous step.
2. Select the **Account** and **Slot** you want to send from.
3. Fill in the destination phone number and message.
4. Execute the workflow.

## Verification Notes

This package is structured so it can be submitted later as a verified community node for n8n Cloud, but Cloud support still depends on n8n approving the package.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [n8n verification guidelines](https://docs.n8n.io/integrations/creating-nodes/build/reference/verification-guidelines/)
* [WaFloW.ai Website](https://waflow.ai)

## License

[MIT](LICENSE.md)
