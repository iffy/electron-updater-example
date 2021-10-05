#!/usr/bin/env /bin/bash
if [ -z "${EXAMPLE_USER}" ] || [ -z "${EXAMPLE_UID}" ]; then
  echo "EXAMPLE_USER and EXAMPLE_UID environment variables must be set" 1>&2
  exit 1
fi
if [ -z "${EXAMPLE_GROUP}" ] || [ -z "${EXAMPLE_GID}" ]; then
  echo "EXAMPLE_GROUP and EXAMPLE_GID environment variables must be set" 1>&2
  exit 1
fi

groupadd --gid "${EXAMPLE_GID}" "${EXAMPLE_GROUP}"
useradd --gid "${EXAMPLE_GID}" --uid "${EXAMPLE_UID}" --shell /bin/bash --no-create-home "${EXAMPLE_USER}"

# Electron Builder seems to rely on the user's home directory being present...
mkdir -p "/home/${EXAMPLE_USER}"
chmod 777 "/home/${EXAMPLE_USER}"

# Electron Builder tries to create /scratch when it needs to build a binary (rather than using prebuilt binaries)
# so create it prior to running it with the necessary permissions.
mkdir -p "/scratch"
chmod 777 "/scratch"

#
# Build the installers
#
cd /project || exit
NPM_COMMAND="npm run publish"
if [ "${HTTPS_PROXY}" != "" ]; then
  NPM_COMMAND="HTTPS_PROXY=${HTTPS_PROXY} $NPM_COMMAND"
fi

su "${EXAMPLE_USER}" --command "${NPM_COMMAND}"

NPM_EXIT_CODE=$?
if [ ${NPM_EXIT_CODE} -ne 0 ]; then
  exit ${NPM_EXIT_CODE}
fi
