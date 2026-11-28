# OpenCode rea MCP Server Failure Investigation

## Root Cause

The `mcp.rea` server in OpenCode's configuration (`C:\Users\rp331\.config\opencode\opencode.jsonc`) is configured as a **local** server:

```json
"rea": {
  "type": "local",
  "command": [
    "cmd.exe",
    "/d",
    "/c",
    "npx",
    "-y",
    "rea-agents@6.7.0",
    "mcp"
  ],
  "enabled": true
}
```

OpenCode attempts to spawn this process on startup. The **"Request timed out"** error occurs because the `rea-agents@6.7.0` package is **not installed globally** and may not be resolvable from OpenCode's execution environment.

### Evidence

1. **Package not globally installed**: `npm list -g rea-agents` returns empty - the package is only referenced in the OpenCode config, not installed as a global dependency.

2. **`npx` availability**: While `npx rea-agents mcp doctor` worked in some contexts, the exact invocation `npx -y rea-agents@6.7.0 mcp` during OpenCode's automated startup may fail because:
   - Version `6.7.0` may not be cached in npx's internal cache
   - OpenCode's execution environment has a different `PATH` than the interactive shell
   - The `cmd.exe /d` flag disables autorun, which can prevent `PATH` from being inherited, making `npx` and `rea-agents` unavailable

3. **Backup config**: `opencode.jsonc.rea.backup` exists without the `rea` MCP entry, suggesting the local rea config was added recently and may not be fully vetted.

4. **Doctor confirms server works**: `npx rea-agents mcp doctor` successfully shows `healthy: true` with 207 tools - confirming the server binary works when properly available.

## Fix

**Install `rea-agents` globally** so it's always available to OpenCode's execution environment:

```bash
npm install -g rea-agents@6.7.0
```

After installation, verify:

```bash
npx rea-agents mcp doctor
```

Should output `healthy: true` with all inventories matching.

## Alternative Options

1. **Use a remote MCP server**: Change the config from `"type": "local"` to `"type": "remote"` with a valid URL, similar to the `21st` server config.

2. **Ensure local availability**: Place `rea-agents` in a directory on the `PATH` that OpenCode can access during startup.

3. **Remove the local rea config**: If the rea MCP server is not needed, remove the `mcp.rea` section from `opencode.jsonc` entirely.

## Post-Fix Verification

After installing globally, run:

```bash
npx rea-agents mcp doctor
```

Expected output should include:
- `healthy: true`
- `inventory:tools` expected=207 observed=207 missing=none
- `inventory:prompts` expected=6 observed=6 missing=none
- No stderr output