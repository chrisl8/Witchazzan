#!/usr/bin/env bash
# shellcheck disable=SC2059

#GREEN='\033[0;32m'
#RED='\033[0;31m'
#PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
LIGHTCYAN='\033[1;36m'
#LIGHTBLUE='\033[1;34m'
LIGHT_PURPLE='\033[1;35m'
BRIGHT_WHITE='\033[1;97m'
NC='\033[0m' # NoColor

if ! (command -v git >/dev/null 2>&1); then
  printf "\n${LIGHT_PURPLE}git is not installed!${NC}\n"
  exit 1
fi

if ! (command -v gcc >/dev/null 2>&1); then
  printf "\n${LIGHT_PURPLE}gcc is not installed!${NC}\n"
  printf "sudo apt install -y gcc\n"
  exit 1
fi

if ! (command -v g++ >/dev/null 2>&1); then
  printf "\n${LIGHT_PURPLE}g++ is not installed!${NC}\n"
  printf "sudo apt install -y g++\n"
  exit 1
fi

if ! (command -v make >/dev/null 2>&1); then
  printf "\n${LIGHT_PURPLE}make is not installed!${NC}\n"
  printf "sudo apt install -y make\n"
  exit 1
fi

if ! (command -v node >/dev/null 2>&1); then
  printf "\n${LIGHT_PURPLE}node is not installed${NC}\n"
  printf "I recommend that you use nvm:\n"
  printf "https://github.com/nvm-sh/nvm\n"
  printf "\n"
  printf "${LIGHTCYAN}wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash${NC}\n"
  printf "${LIGHTCYAN}nvm install --lts${NC}\n"
  exit 1
fi

REQUIRED_NODE_VERSION=19
if ! (node -v | grep "v${REQUIRED_NODE_VERSION}" >/dev/null); then
  printf "\n${LIGHT_PURPLE}Node version ${REQUIRED_NODE_VERSION} is required${NC}\n"
  printf "Use node -v to check your version\n"
  printf "and update your node version.\n"
  printf "\n"
  printf "If you are already using nvm, then just run this to update node:\n"
  printf "${LIGHTCYAN}nvm install node ${REQUIRED_NODE_VERSION}${NC}\n"
  exit 1
fi

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

cd "${PARENT_DIR}" || exit
printf "\n${YELLOW}[Pulling latest changes from the GitHub repo]${NC}\n"
git pull
echo ""
printf "\n${YELLOW}[Installing dependencies]${NC}\n"
npm ci

# This is built into the web site, so it has to be done before the build, where the build happens.
"${SCRIPT_DIR}/versionNumberUpdate.sh"

printf "\n"
printf "${BRIGHT_WHITE}=======================================================================${NC}\n"
printf "For development open two terminals windows:\n"
printf "\n"
printf "${BRIGHT_WHITE}-------------------------${NC}\n"
printf "${YELLOW}SERVER:${NC} In the first run:\n"
printf "${LIGHTCYAN}cd ${PARENT_DIR}${NC}\n"
printf "${LIGHTCYAN}npm run server${NC}\n"
printf "\n"
printf "This will start the server, and restart it when file changes are made.\n"
printf "It is the same as running 'node server.js', except that it will\n"
printf "auto restart when you update your code."
printf "\n"
printf "\n"
printf "${BRIGHT_WHITE}--------------------------${NC}\n"
printf "${YELLOW}CLIENT:${NC} In the second run:\n"
printf "${LIGHTCYAN}cd ${PARENT_DIR}${NC}\n"
printf "${LIGHTCYAN}npm run client${NC}\n"
printf "\n"
printf "This will build the client as well as rebuild and cause a browser refresh\n"
printf "when file changes are made.\n"
printf "It should also automatically open your web browser to the page,\n"
printf "but if not, go to http://localhost:3001\n"
