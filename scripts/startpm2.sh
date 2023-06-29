#!/usr/bin/env bash
export NVM_DIR="${HOME}/.nvm"
[ -s "$NVM_DIR/nvm.sh"   ] && . "$NVM_DIR/nvm.sh"  # This loads nvm
cd "${HOME}/Witchazzan" || exit
pm2 start "${HOME}/Witchazzan/scripts/pm2Config.json"
