import * as core from '@actions/core';
import { TrueNASClient, type JSONRPCResponse } from 'truenas-client';

export async function run(): Promise<void> {
  try {
    // Get inputs from GitHub Actions
    const host: string = core.getInput('host', { required: true });
    const apiKey: string = core.getInput('api-key', { required: true });
    const apiMethod: string = core.getInput('api-method', { required: true });
    const parametersInput: string = core.getInput('parameters');

    // Log inputs for debugging (mask API key)
    core.info(`Connecting to TrueNAS at: ${host}`);
    core.info(`Executing method: ${apiMethod}`);

    // Parse parameters if provided, default to empty array
    let params: any = [];
    if (parametersInput && parametersInput.trim() !== '') {
      try {
        params = JSON.parse(parametersInput);
        core.info(`Parameters parsed successfully: ${JSON.stringify(params)}`);
      } catch (parseError: unknown) {
        const message = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
        core.error(`Failed to parse parameters as JSON: ${message}`);
        throw parseError;
      }
    } else {
      core.info('No parameters provided, using empty array');
    }

    // Create TrueNAS client instance
    const client = new TrueNASClient(host, apiKey);

    // Send the API request
    core.info(`Sending API request...`);
    const response: JSONRPCResponse = await client.sendRequest(apiMethod, params, );

    // Check for errors in the response
    if (response.error) {
      core.error(`TrueNAS API Error ${response.error.code}: ${response.error.message}`);
      if (response.error.data) {
        core.error(`Error data: ${JSON.stringify(response.error.data)}`);
      }
      throw new Error(`TrueNAS API returned error: ${response.error.message}`);
    }

    // Success - set output and log result
    const result = response.result;
    const resultJson: string = JSON.stringify(result);
    
    const preview = resultJson.length > 200 
      ? `${resultJson.substring(0, 200)}...` 
      : resultJson;
    core.info(`API call successful. Result: ${preview}`);
    core.setOutput('result', resultJson);

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    core.setFailed(message);
  }
}
