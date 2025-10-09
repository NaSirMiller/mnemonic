#!/bin/bash
set -e

# Usage: ./run.sh [npm_install_flag]
# Example: ./run.sh 1   → run npm install before starting apps
#          ./run.sh 0   → skip npm install

# Get the npm install flag (default: 0)
run_npm_install=${1:-0}

# Get the absolute directory of this script
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

frontend_pid=
backend_pid=

cleanup() {
  echo "Stopping apps..."
  kill $frontend_pid $backend_pid 2>/dev/null || true
  exit 0
}

trap cleanup SIGINT

run_app() {
  local app_dir="$1"
  local run_npm_install="$2"
  local log_file="$script_dir/${app_dir}.log"

  echo "Starting $app_dir..."

  cd "$script_dir/$app_dir" || { echo "Directory $app_dir not found"; return 1; }

  # Optionally run npm install
  if [ "$run_npm_install" -eq 1 ]; then
    echo "Running npm install for $app_dir..."
    npm install >> "$log_file" 2>&1
    echo "npm install complete for $app_dir."
  fi

  # Run app
  if [ "$app_dir" = "frontend" ]; then
    # Free old vite ports if needed
    fuser -k 5173/tcp 5174/tcp 5175/tcp 2>/dev/null || true
    npm run dev >> "$log_file" 2>&1 &
    frontend_pid=$!
  else
    npm run start:dev >> "$log_file" 2>&1 &
    backend_pid=$!
  fi

  cd - > /dev/null
}

# Run both apps
run_app "frontend" $run_npm_install || true
run_app "backend" $run_npm_install || true

echo "Press Ctrl+C to end"
wait

