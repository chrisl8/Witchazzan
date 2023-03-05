#!/usr/bin/env bash
# shellcheck disable=SC2059

set -e
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
npm ci

# This is built into the web site, so it has to be done before the build, where the build happens.
"${SCRIPT_DIR}/versionNumberUpdate.sh"

printf "\n${YELLOW}Building client locally...${NC}\n"
if [[ -d .parcel-cache ]]; then
  rm -rf .parcel-cache
fi
npm run build

printf "\n${YELLOW}Preparing remote side for update${NC}\n"
ssh ekpyroticfrood.net 'cd ~/Witchazzan || exit && git pull && PATH=~/.nvm/current/bin:$PATH ~/.nvm/current/bin/npm ci --omit=dev && rm web-dist/*'

printf "\n${YELLOW}Copying new built web files to server${NC}\n"
scp web-dist/* ekpyroticfrood.net:./Witchazzan/web-dist
# Copy the version number we built into the web site to the server.
scp server/utilities/version.js ekpyroticfrood.net:./Witchazzan/server/utilities/version.js

printf "\n${YELLOW}Restarting server:${NC}\n"
ssh ekpyroticfrood.net 'cd ~/Witchazzan || exit && PATH=~/.nvm/current/bin:$PATH ~/.nvm/current/bin/pm2 restart Witchazzan'
