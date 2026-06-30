# Feature Categories

## 5 categories, 69 features total

### 1. Hooks & Lifecycle (32 features) — `hooks.json`

Grounded in actual documentation from 6 agents' hooks docs:
- Claude Code: https://code.claude.com/docs/en/hooks (27 events, 5 handler types)
- Codex CLI: https://developers.openai.com/codex/hooks (6 events, command handlers only)
- Cursor: https://cursor.com/docs/hooks (18 events, command + prompt handlers)
- Devin: https://cli.devin.ai/docs/extensibility/hooks/overview (7 events)
- Copilot: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/use-hooks (6 events)

6 sub-groups:
- **Core Lifecycle Events** (7): session-start, session-end, pre-tool-use, post-tool-use, user-prompt-submit, stop, permission-request
- **Tool-Specific Hooks** (5): pre-shell-execution, pre-file-read, pre-file-write, post-file-edit, pre-mcp-tool-use
- **Advanced Events** (7): subagent-start/stop, compaction-hooks, error-event, post-agent-response, file-watch, worktree-hooks
- **Handler Types** (5): command, prompt, http, mcp-tool, agent
- **Control Flow** (5): blocking-hooks, async-hooks, matcher-patterns, hook-json-io, hook-timeout
- **Configuration Scope** (3): project, user, org

Note: `compaction-hooks` (hooks that fire around compaction) is different from `context-compaction` (the compaction capability itself in the memory category). They were originally both `context-compaction` — renamed to avoid collision.

### 2. Model Context Protocol (12 features) — `mcp.json`

Grounded in MCP spec (https://modelcontextprotocol.io/specification/2025-06-18):
- **Transports** (3): stdio, SSE, streamable-http
- **Server Primitives** (3): tools, resources, prompts
- **Client Features** (3): sampling, roots, elicitation
- **Auth & Config** (3): oauth, config-project, config-user

### 3. Instructions (6 features) — `instructions.json`

How you tell the agent what to do:
- **Scope** (3): project-instructions, user-instructions, org-instructions
- **Targeting** (2): path-scoped-rules, instruction-imports
- **Interop** (1): agents-md-compat

### 4. Memory (3 features) — `memory.json`

How the agent persists its own knowledge:
- **Persistence** (2): auto-memory, conversation-resume
- **Context Management** (1): context-compaction

### 5. Built-in Tools (16 features) — `tools.json`

Native capabilities:
- **File Operations** (3): file-read, file-edit, notebook-edit
- **Shell & Execution** (3): shell-execution, background-monitor, scheduled-tasks
- **Search** (4): code-search, semantic-search, web-search, web-fetch
- **Code Intelligence** (4): lsp-integration, browser-control, image-input, image-generation
- **Orchestration** (2): subagent-spawning, task-management

## Design rationale

- Hooks and MCP have real specs/docs to compare against → high confidence data
- Instructions and Memory are empirical ("does this agent have this capability") not spec-based
- Tools are straightforward capability checks
- Support levels include `via-mcp`, `via-skill`, `via-extension` for features achievable through add-ons (like caniuse's "with polyfill")
- `group` field on features enables visual sub-categorization within each category
