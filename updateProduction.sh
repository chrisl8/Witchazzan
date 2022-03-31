#!/usr/bin/env bash
#!/usr/bin/env bash
export NVM_DIR="${HOME}/.nvm"
[ -s "$NVM_DIR/nvm.sh"   ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

# Grab and save the path to this script
# http://stackoverflow.com/a/246128
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we
need to resolve it relative to the path where the symlink file was located
done
SCRIPTDIR="$(cd -P "$(dirname "$SOURCE")" && pwd)"
# echo "${SCRIPTDIR}" # For debugging

cd "${SCRIPTDIR}" || exit
git pull
cd "${SCRIPTDIR}/server" || exit
npm ci
cd "${SCRIPTDIR}/client" || exit
npm ci
npm run build
pm2 restart Witchazzan
