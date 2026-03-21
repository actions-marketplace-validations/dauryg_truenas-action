# TrueNAS Scale API Client Action

A Github action to interact with truenas through its JSON-RPC 2.0 websocket api

## Description

`TrueNAS Scale API Client` connects to the TrueNAS WebSocket endpoint, authenticates with the supplied API key, and calls the specified API method. The result of the call is emitted as a JSON string in the `result` output.

## Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `host` | WebSocket URL for TrueNAS Scale (e.g., `wss://192.168.1.100/api/current`) | ✅ | — |
| `api-key` | API key for authentication | ✅ | — |
| `api-method` | TrueNAS API method name (e.g., `pool.query`, `alert.list`, `system.info`) | ✅ | — |
| `parameters` | JSON array of method arguments. Example: `[]`, `[{"limit":2}]`, `[[["name","~",".*media.*"]],{"limit":3,"select":["name","pool"]}]` | ❌ | — |

## Outputs

| Output | Description |
|--------|-------------|
| `result` | JSON string returned by the TrueNAS API call |

## Usage

```yaml
- name: Query TrueNAS pools
  uses: dauryg/truenas-action@v1
  with:
    host: wss://192.168.1.100/api/current
    api-key: ${{ secrets.TRUENAS_API_KEY }}
    api-method: pool.query
    parameters: '[]'
```

> **Tip**: Wrap complex JSON data in single quotes to avoid YAML parsing issues.

## Notes

- Store your `api-key` in GitHub Secrets.
- The action runs on Node.js 24.
