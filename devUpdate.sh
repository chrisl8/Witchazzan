#!/usr/bin/env bash

GREEN='\033[0;32m'
RED='\033[0;31m'
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

if ! (command -v node >/dev/null 2>&1); then
    printf "\n${LIGHT_PURPLE}node is not installed${NC}\n"
    printf "I recommend that you use nvm:\n"
    printf "https://github.com/nvm-sh/nvm\n"
    printf "\n"
    printf "${LIGHTCYAN}wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash${NC}\n"
    printf "${LIGHTCYAN}nvm install --lts${NC}\n"
    exit 1
fi

if ! (node -v | grep "v16" > /dev/null); then
  printf "\n${LIGHT_PURPLE}Node 16 (LTS) is required${NC}\n"
  printf "Use node -v to check your version\n"
  printf "and update your node version.\n"
  printf "\n"
  printf "If you are using nvm, then run this to update node:\n"
  printf "${LIGHTCYAN}nvm install --lts${NC}\n"
  exit 1
fi

printf "\n${YELLOW}[Installing pm2 for running Dev Server]${NC}\n"
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
printf "\n${YELLOW}[Pulling latest changes from the GitHub repo]${NC}\n"
git pull
cd "${SCRIPT_DIR}/server" || exit
echo ""
printf "\n${YELLOW}[Installing dependencies for server]${NC}\n"
npm ci
cd "${SCRIPT_DIR}/client" || exit
echo ""
printf "\n${YELLOW}[Installing dependencies for client]${NC}\n"
npm ci

printf "\n"
printf "${BRIGHT_WHITE}======================================================================================${NC}\n"
printf "For development open two terminals windows:\n"
printf "\n"
printf "${YELLOW}SERVER:${NC} In the first run:\n"
printf "${LIGHTCYAN}cd ${SCRIPT_DIR}/server${NC}\n"
printf "${LIGHTCYAN}pm2-dev server.js${NC}\n"
printf "\n"
printf "This will start the server, and restart it when file changes are made.\n"
printf "It is the same as running 'node server.js', except that it will\n"
printf "auto restart when you update your code."
printf "\n"
printf "\n"
printf "${BRIGHT_WHITE}------------------${NC}\n"
printf "${YELLOW}CLIENT:${NC} In the second run:\n"
printf "${LIGHTCYAN}cd ${SCRIPT_DIR}/client${NC}\n"
printf "${LIGHTCYAN}npm run start${NC}\n"
printf "\n"
printf "This will build the client as well as rebuild and cause a browser refresh\n"
printf "when file changes are made.\n"
printf "It should also automatically open your web browser to the page,\n"
printf "but if not, go to http://localhost:3001\n"
