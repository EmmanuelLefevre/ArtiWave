# Variables definition
export SONAR_HOST=172.17.0.2:9000
export SONAR_TOKEN=246ab003c10235fe67159a918d5580f1d7db44e9
export REPO=$(pwd)
export CONFIG_FILE=$(pwd)/sonar-project.properties

# SonarQube scanner execution
docker run \
    --rm \
    -e SONAR_HOST_URL="http://${SONAR_HOST}" \
    -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=ArtiWave" \
    -e SONAR_LOGIN="${SONAR_TOKEN}" \
    -v "${REPO}:/usr/src" \
    -v "${CONFIG_FILE}:/opt/sonar-scanner/conf/sonar-project.properties" \
    sonarsource/sonar-scanner-cli
