FROM ubuntu:18.04
LABEL org.label-schema.schema-version = "1.0.0-rc.1"                                                                \
      org.label-schema.name           = "Asqtasun 5.0.0-rc.2 - API server (Ubuntu 18.04, Java 8, Firefox 102.8.0esr, Geckodriver 0.32.2)"  \
      org.label-schema.url            = "https://asqatasun.org/"                                                    \
      org.label-schema.vcs-url        = "https://gitlab.com/asqatasun/Asqatasun"                                    \
      org.label-schema.usage          = "https://doc.asqatasun.org/"                                                \
      org.label-schema.description    = "Asqatasun: opensource web site analyser, used for web accessibility (a11y)"
          # ----> documentation  http://label-schema.org/
################################################################################################################

# Environment variables
ENV    JAVA_PATH="/usr/bin/java"                    \
       WWW_PORT="8080"                              \
       DB_PORT="3306"                               \
       DB_HOST="asqatasun-db"                       \
       DB_DRIVER="mysql"                            \
       DB_DATABASE="asqatasun"                      \
       DB_USER="asqatasunDatabaseUserLogin"         \
       DB_PASSWORD="asqatasunDatabaseUserP4ssword"  \
       LOG_DIR="/var/log/asqatasun/"                \
       DEBUG_DISPLAY_SOFTWARE_VERSIONS="disabled"   \
       ASQA_RELEASE="5.0.0-rc.2"                  \
       FIREFOX_VERSION="102.8.0esr"                 \
       GECKODRIVER_VERSION="v0.32.2"                \
       FIREFOX_URL_PREFIX="https://download-installer.cdn.mozilla.net/pub/firefox/releases/"  \
       GECKODRIVER_URL_PREFIX="https://github.com/mozilla/geckodriver/releases/download/"     \
       ASQATASUN_URL_PREFIX="https://gitlab.com/api/v4/projects/20815843/packages/generic/Asqatasun"
ENV    WWW_URL="http://localhost:${WWW_PORT}/"      \
       ASQATASUN_TYPE="asqatasun_api"               \
       JAVA_FILE_NAME="asqatasun-server-${ASQA_RELEASE}.jar"
EXPOSE ${WWW_PORT}

# Build variables
ARG FIREFOX_URL="${FIREFOX_URL_PREFIX}${FIREFOX_VERSION}/linux-x86_64/en-US/firefox-${FIREFOX_VERSION}.tar.bz2"
ARG GECKODRIVER_URL="${GECKODRIVER_URL_PREFIX}${GECKODRIVER_VERSION}/geckodriver-${GECKODRIVER_VERSION}-linux64.tar.gz"
ARG ASQATASUN_URL="${ASQATASUN_URL_PREFIX}/${ASQA_RELEASE}/${JAVA_FILE_NAME}"

################################################################################################################

# System prerequisites
RUN apt-get update                    && \
    apt-get -y --no-install-recommends   \
            install openjdk-8-jre        \
                    libgtk-3-0           \
                    libdbus-glib-1-2     \
                    curl              && \
    apt-get clean                     && \
    rm -rf /var/lib/apt/lists/*

# Add a new Linux user and ceate log folder
RUN adduser --disabled-password --gecos "" asqatasun    && \
    mkdir "${LOG_DIR}" && chown asqatasun:asqatasun "${LOG_DIR}"

# Set SHELL option -o pipefail before RUN with a pipe in it (see: https://github.com/hadolint/hadolint/wiki/DL4006)
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Download Asqatasun and its latest prerequisites
RUN printf '%s\n%s\n%s\n' "${FIREFOX_URL}" "${GECKODRIVER_URL}" "${ASQATASUN_URL}"  && \
    curl --fail -Ls "${ASQATASUN_URL}" -o "/home/asqatasun/${JAVA_FILE_NAME}"       && \
    curl --fail -Ls "${FIREFOX_URL}"     | tar xj -C "/opt/"                        && \
    curl --fail -Ls "${GECKODRIVER_URL}" | tar xz -C "/opt/"

# Add bash files (entrypoint + healthcheck) and switch to final user
COPY "bin/docker_healthcheck.sh" "/usr/local/bin/docker_healthcheck.sh"
COPY "bin/docker_entrypoint.sh"  "/usr/local/bin/docker_entrypoint.sh"
USER asqatasun:asqatasun

################################################################################################################
ENTRYPOINT ["docker_entrypoint.sh"]
HEALTHCHECK --start-period=25s --interval=25s --timeout=15s CMD "docker_healthcheck.sh" || exit 1
            ###########################################################################
            # see: https://docs.docker.com/engine/reference/builder/#healthcheck
            # options:   --start-period=(default: 0s)    --timeout=(default: 30s)
            #            --interval=(default: 30s)       --retries=(default: 3)
            ###########################################################################
            # Can be overridden by 'docker container run --health-cmd|--health-retries'
            ###########################################################################
