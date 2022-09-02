#!/usr/bin/env bash
# shellcheck disable=SC2059

#GREEN='\033[0;32m'
#RED='\033[0;31m'
#PURPLE='\033[0;35m'
YELLOW='\033[1;33m'
#LIGHTCYAN='\033[1;36m'
#LIGHTBLUE='\033[1;34m'
#LIGHT_PURPLE='\033[1;35m'
#BRIGHT_WHITE='\033[1;97m'
NC='\033[0m' # NoColor

# Grab and save the path to this script
# http://stackoverflow.com/a/246128
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
#SCRIPT_DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
PARENT_DIR="$(cd -P "$(dirname "$SOURCE")/.." && pwd)"
# echo "${SCRIPT_DIR}" # For debugging

cd "${PARENT_DIR}/shared" || exit
printf "\n${YELLOW}[Checking dependencies for shared code]${NC}\n"
npm outdated
cd "${PARENT_DIR}/server" || exit
echo ""
printf "\n${YELLOW}[Checking dependencies for server]${NC}\n"
npm outdated
cd "${PARENT_DIR}/client" || exit
echo ""
printf "\n${YELLOW}[Checking dependencies for client]${NC}\n"
npm outdated
