#!/usr/bin/env bash

default_install_dir="${HOME}/.zx"
if [ -f "$default_install_dir" ]; then
    echo "default install dir exists"
else
    mkdir -p $default_install_dir
fi

echo '#!/usr/bin/env bash
node $HOME/.zx/zx.mjs "$@"' > $default_install_dir/zx

chmod +x $default_install_dir/zx

curl -L -o $default_install_dir/zx.mjs https://github.com/fullstackoverflow/zx-build/releases/download/7.2.2/zx.mjs

SOURCE_STR="PATH=\$PATH:\$HOME/.zx"

if grep -q "$SOURCE_STR" "$HOME/.bashrc"; then
    :
else
    echo "\\n$SOURCE_STR" >> "$HOME/.bashrc"
fi