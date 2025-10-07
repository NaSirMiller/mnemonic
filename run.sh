frontend_pid=
backend_pid=

run_app() {
  local app_dir="$1"
  local run_npm_install="$2"
  local log_file="../${app_dir}.log"

  cd "$app_dir" || { echo "Directory $app_dir not found"; return 1; }

  if [ "$run_npm_install" -eq 1 ]; then
    npm install >> "$log_file" 2>&1
  fi

  if [ "$app_dir" = "frontend" ]; then
    npm run dev >> "$log_file" 2>&1 &
    frontend_pid=$!
  else
    npm run start:dev >> "$log_file" 2>&1 &
    backend_pid=$!
  fi

  cd - > /dev/null
}

run_app "frontend" 1
run_app "backend" 1

echo "Press Ctrl+C to end"

# Trap Ctrl+C to kill child processes
trap "echo 'Stopping apps...'; kill $frontend_pid $backend_pid; exit 0" SIGINT

# Wait for all background processes
wait
