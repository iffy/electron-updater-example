#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "$0")
export WORKSPACE=$(cd "${SCRIPT_DIR}/.."; pwd)
if [ -z "${GH_TOKEN}" ]; then
  echo "GH_TOKEN environment variable must be set prior to running this script">&2
  exit 1
fi

EXAMPLE_ENV_FILE="${WORKSPACE}/docker.env"
echo "EXAMPLE_USER=$(id -un)" > "${EXAMPLE_ENV_FILE}"
# shellcheck disable=SC2129
echo "EXAMPLE_UID=$(id -u)" >> "${EXAMPLE_ENV_FILE}"
echo "EXAMPLE_GROUP=$(id -gn)" >> "${EXAMPLE_ENV_FILE}"
echo "EXAMPLE_GID=$(id -g)" >> "${EXAMPLE_ENV_FILE}"
echo "GH_TOKEN=${GH_TOKEN}" >> "${EXAMPLE_ENV_FILE}"

if [ -n "${HTTPS_PROXY}" ]; then
  echo "HTTPS_PROXY=${HTTPS_PROXY}" >> "${EXAMPLE_ENV_FILE}"
fi

docker run --rm -v "${WORKSPACE}:/project" --env-file "${EXAMPLE_ENV_FILE}" electronuserland/builder /project/build/linuxInstallersInDocker.sh
