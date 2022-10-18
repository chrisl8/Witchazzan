#!/usr/bin/env bash
export NVM_DIR="${HOME}/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" # This loads nvm

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

echo "Backing up persistent hadrons..."
ls -lah persistentData/hadrons.json5
mkdir -p persistentData/backups
cp persistentData/hadrons.json5 persistentData/backups
ls -lah persistentData/backups/hadrons.json5

echo "Pulling latest changes from the GitHub repo:"
git pull
echo ""
echo "Installing dependencies..."
npm ci
echo ""
"${SCRIPT_DIR}/versionNumberUpdate.sh"
echo ""
echo "Building client (this is the slow part)..."
if [[ -d .parcel-cache ]]; then
  rm -rf .parcel-cache
fi
npm run build
echo ""
echo "Restarting server:"

ls -lah persistentData/hadrons.json5
pm2 restart Witchazzan
ls -lah persistentData/hadrons.json5
