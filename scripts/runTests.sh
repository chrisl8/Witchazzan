#!/usr/bin/env bash
# shellcheck disable=SC2059

set -e

WIPE_SCREENSHOTS=false
HEADED=false

while test $# -gt 0; do
  case "$1" in
  --reset)
    WIPE_SCREENSHOTS=true
    ;;
  --headed)
    HEADED=true
    ;;
  *)
    echo "Invalid argument"
    exit
    ;;
  esac
  shift
done

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

cd "${PARENT_DIR}" || exit

if [[ "${WIPE_SCREENSHOTS}" == "true" ]]; then
  rm -f tests/runGame.spec.js-snapshots/*
fi

if [[ "${HEADED}" == "true" ]]; then
  npx playwright test --headed
else
  npx playwright test
fi
