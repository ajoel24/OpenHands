import {
  pollForToken as sdkPollForToken,
  startDeviceFlow as sdkStartDeviceFlow,
} from "@ajoel24/openhands-typescript-client/client/device-flow-client";
import type {
  DeviceAuthorizationResponse,
  DeviceTokenResponse,
  PollDeviceTokenOptions,
} from "@ajoel24/openhands-typescript-client/client/device-flow-client";
import { AGENT_CANVAS_CLIENT_HEADERS } from "./client-source";

export {
  DeviceFlowError,
  isOpenHandsCloudHost,
} from "@ajoel24/openhands-typescript-client/client/device-flow-client";

export function startDeviceFlow(
  host: string,
): Promise<DeviceAuthorizationResponse> {
  return sdkStartDeviceFlow(host, { headers: AGENT_CANVAS_CLIENT_HEADERS });
}

export function pollForToken(
  host: string,
  deviceCode: string,
  options: PollDeviceTokenOptions,
): Promise<DeviceTokenResponse> {
  return sdkPollForToken(host, deviceCode, {
    ...options,
    headers: AGENT_CANVAS_CLIENT_HEADERS,
  });
}

export type {
  DeviceAuthorizationResponse,
  DeviceTokenResponse,
  PollDeviceTokenOptions as PollOptions,
} from "@ajoel24/openhands-typescript-client/client/device-flow-client";
