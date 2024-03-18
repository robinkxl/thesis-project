#!/usr/bin/env bash
set -Eeuo pipefail

# Common parameters
JDBC_URL="jdbc:${DB_DRIVER}://${DB_HOST}:${DB_PORT}/${DB_DATABASE}"

# Display software versions
if [[ "${DEBUG_DISPLAY_SOFTWARE_VERSIONS}" == "enabled" ]]; then
    JAVA_FILE_SHA256=$(sha256sum "/home/asqatasun/${JAVA_FILE_NAME}")
    DISPLAY_GECKODRIVER_VERSION=$(/opt/geckodriver -V        | head -n 1)
    DISPLAY_FIREFOX_VERSION=$(/opt/firefox/firefox --version | head -n 1)
    DISPLAY_JAVA_VERSION=$("${JAVA_PATH}" -version 2>&1)
    DISPLAY_OS_RELEASE=$(cat /etc/os-release)
    echo "######### ENTRYPOINT ${ASQATASUN_TYPE} #######################"
    echo "INFO - Java file   ---> ${JAVA_FILE_NAME}"
    echo "INFO - SHA256      ---> ${JAVA_FILE_SHA256}"
    echo "INFO - JDBC config ---> ${JDBC_URL}"
    echo "INFO - GECKODRIVER ---> ${DISPLAY_GECKODRIVER_VERSION}"
    echo "INFO - FIREFOX     ---> ${DISPLAY_FIREFOX_VERSION}"
    echo "INFO - JAVA        ---> ${DISPLAY_JAVA_VERSION}"
    echo "------ INFO - Operating System --------------------------"
    echo "${DISPLAY_OS_RELEASE}"
    echo "---------------------------------------------------------"
fi

# Start JAVA application
if [[ "${ASQATASUN_TYPE}" == "asqatasun_webapp" ]]; then
    "${JAVA_PATH}"                                             \
        -Dapp.logging.path="${LOG_DIR}"                        \
        -Djdbc.url="${JDBC_URL}"                               \
        -Djdbc.user="${DB_USER}"                               \
        -Djdbc.password="${DB_PASSWORD}"                       \
        -Dwebdriver.firefox.bin=/opt/firefox/firefox           \
        -Dwebdriver.gecko.driver=/opt/geckodriver              \
        -jar "/home/asqatasun/${JAVA_FILE_NAME}"               \
        --server.port="${WWW_PORT}"
elif [[ "${ASQATASUN_TYPE}" == "asqatasun_api" ]]; then
    "${JAVA_PATH}"                                             \
        -Dapp.logging.path="${LOG_DIR}"                        \
        -Dapp.engine.loader.selenium.headless=true             \
        -Djdbc.url="${JDBC_URL}"                               \
        -Djdbc.user="${DB_USER}"                               \
        -Djdbc.password="${DB_PASSWORD}"                       \
        -Dwebdriver.firefox.bin=/opt/firefox/firefox           \
        -Dwebdriver.gecko.driver=/opt/geckodriver              \
        -jar "/home/asqatasun/${JAVA_FILE_NAME}"               \
        --server.port="${WWW_PORT}"
fi

exec "$@"
