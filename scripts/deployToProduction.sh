#!/usr/bin/env bash
# shellcheck disable=SC2059

set -e

if [[ $# -eq 0 ]]; then
  echo "You must provide server name to deploy to."
  exit
fi

export NVM_DIR="${HOME}/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

YELLOW='\033[1;33m'
NC='\033[0m' # NoColor

# Grab and save the path to this script
# http://stackoverflow.com/a/246128
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
PARENT_DIR="$(cd -P "$(dirname "$SOURCE")/.." && pwd)"
# echo "${SCRIPT_DIR}" # For debugging

cd "${PARENT_DIR}" || exit

printf "\n${YELLOW}Pulling latest changes from the GitHub repo:${NC}\n"
git pull

printf "\n${YELLOW}Installing dependencies...${NC}\n"
if ! (command -v pnpm >/dev/null 2>&1); then
  npm install -g pnpm
fi
pnpm i

# This is built into the web site, so it has to be done before the build, where the build happens.
"${SCRIPT_DIR}/versionNumberUpdate.sh"

printf "\n${YELLOW}Building client locally...${NC}\n"
if [[ -d .parcel-cache ]]; then
  rm -rf .parcel-cache
fi
pnpm run build

printf "\n${YELLOW}Preparing remote side for update${NC}\n"
ssh.exe "${USER}@${1}" 'if ! (command -v pnpm >/dev/null 2>&1);then PATH=~/.nvm/current/bin:$PATH ~/.nvm/current/bin/npm install -g pnpm;fi'
ssh.exe "${USER}@${1}" 'cd ~/Witchazzan || exit && git pull && PATH=~/.nvm/current/bin:$PATH pnpm i --prod && mkdir stage'

printf "\n${YELLOW}Copying new built web files to server${NC}\n"
scp.exe web-dist/* "${USER}@${1}":./Witchazzan/stage
# Copy the version number we built into the web site to the server.
scp.exe server/utilities/version.js "${USER}@${1}":./Witchazzan/server/utilities/version.js

printf "\n${YELLOW}Restarting server:${NC}\n"
ssh.exe "${USER}@${1}" 'cd ~/Witchazzan || exit && rm -rf web-dist && mv stage web-dist && PATH=~/.nvm/current/bin:$PATH ~/.nvm/current/bin/pm2 restart Witchazzan'
