#!/usr/bin/env bash
# App platform gate: runtime, generator and sample apps (bun; no Cargo, no app
# build). Manifests (samples included) are validated by the Rust crate
# cmux-app-manifest and the native host by cmux-app-host, both in the hosted
# cmux-tui verification.
set -euo pipefail
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
host="$root/cmux-tui/crates/cmux-app-host"
bun "$host/js/build.ts" --check
bun "$host/tools/gen-cmux-global.ts" --check
bun "$root/samples/apps/build.ts" --check
(cd "$host/js" && bun test)
"$root/scripts/cmux-next/sync-app-runtime.sh" --check
echo "app platform checks passed"
