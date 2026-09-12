#!/usr/bin/env bash

# LifeRPG Server Starter & Process Manager
# Graceful lifecycle management: handles start, dependency checks, and clean shutdown on Ctrl+C.

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

PORT="${PORT:-3000}"

echo "========================================================"
echo "   ⚔️  LifeRPG - Gamified Habit & Quest Engine          "
echo "========================================================"

# Pre-cleanup: check if any process is already lingering on the target port
cleanup_port() {
  local port="$1"
  local pids
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "⚠️  Releasing port $port held by previous process(es): $pids"
    kill -15 $pids 2>/dev/null || true
    sleep 0.5
    local pids_remaining
    pids_remaining=$(lsof -ti tcp:"$port" 2>/dev/null || true)
    if [ -n "$pids_remaining" ]; then
      kill -9 $pids_remaining 2>/dev/null || true
    fi
  fi
}

cleanup_port "$PORT"

SERVER_PID=""

cleanup() {
  # Disable traps during teardown to avoid recursion
  trap - SIGINT SIGTERM EXIT

  echo ""
  echo "🛑 Stopping LifeRPG application..."

  # 1. Kill main server process if running
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    kill -TERM "$SERVER_PID" 2>/dev/null || true
    local count=0
    while kill -0 "$SERVER_PID" 2>/dev/null && [ "$count" -lt 6 ]; do
      sleep 0.3
      count=$((count + 1))
    done
    if kill -0 "$SERVER_PID" 2>/dev/null; then
      kill -9 "$SERVER_PID" 2>/dev/null || true
    fi
  fi

  # 2. Terminate any sub-jobs spawned by this shell
  local bg_pids
  bg_pids=$(jobs -p 2>/dev/null || true)
  if [ -n "$bg_pids" ]; then
    kill -9 $bg_pids 2>/dev/null || true
  fi

  # 3. Ensure target port is completely cleared
  cleanup_port "$PORT"

  echo "✅ LifeRPG shutdown successfully. No background servers running."
  exit 0
}

# Trap termination signals
trap cleanup SIGINT SIGTERM EXIT

# 1. Verify dependencies
if [ ! -d "node_modules" ]; then
  echo "📦 node_modules missing. Installing dependencies..."
  npm install
fi

# 2. Check database status & sync any local data to MongoDB if available
if [ -f "scripts/sync-to-mongodb.mjs" ]; then
  echo "🔍 Verifying MongoDB connection & synchronizing data..."
  node scripts/sync-to-mongodb.mjs || true
fi

echo ""
echo "🚀 Starting Next.js development server at http://localhost:$PORT"
echo "👉 Press [Ctrl+C] at any time to shut down the server cleanly."
echo "--------------------------------------------------------"

# Launch next dev
npm run dev -- -p "$PORT" &
SERVER_PID=$!

# Wait for server process
wait "$SERVER_PID"
