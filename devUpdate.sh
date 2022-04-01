#!/usr/bin/env bash
if ! (command -v git >/dev/null 2>&1); then
    echo "git is not installed"
    exit 1
fi

if ! (command -v node >/dev/null 2>&1); then
    echo "node is not installed"
    echo "I recommend that you use nvm:"
    echo "https://github.com/nvm-sh/nvm"
    echo ""
    echo "wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash"
    echo "nvm install --lts"
    exit 1
fi

if ! (node -v | grep "v16" > /dev/null); then
  echo "Node 16 (LTS) is required"
  echo "Use node -v to check your version"
  echo "and update your node version"
  exit 1
fi

npm i -g pm2

# Grab and save the path to this script
# http://stackoverflow.com/a/246128
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we
need to resolve it relative to the path where the symlink file was located
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
# echo "${SCRIPT_DIR}" # For debugging

cd "${SCRIPT_DIR}" || exit
git pull
cd "${SCRIPT_DIR}/server" || exit
npm ci
cd "${SCRIPT_DIR}/client" || exit
npm ci

echo ""
echo "----------------------------------------------"
echo "For development open two terminals (or panes)."
echo ""
echo "In the first run:"
echo "cd ${SCRIPT_DIR}/server"
echo "pm2-dev server.js"
echo ""
echo "This will star the server. amd restart ot when file changes are made."
echo ""
echo "In the second run:"
echo "cd ${SCRIPT_DIR}/client"
echo "npm run start"
echo ""
echo "This will star the client. amd restart ot when file changes are made."
echo ""
echo "Now go to http://localhost:3000"
echo "This is the default port for the client that will also connect to the local server, and refresh when changes are made."