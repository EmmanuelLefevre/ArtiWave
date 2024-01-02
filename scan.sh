export SONAR_HOST=172.17.0.2:9000
export SONAR_TOKEN=f877cb73d5a723c32bdb54e1c0a8d9ca2192854f
export REPO=$(pwd)
export CONFIG_FILE=$(pwd)/sonar-project.properties

docker run \
    --rm \
    -e SONAR_HOST_URL="http://${SONAR_HOST}" \
    -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=ArtiWave" \
    -e SONAR_LOGIN="${SONAR_TOKEN}" \
    -v "${REPO}:/usr/src" \
    -v $CONFIG_FILE:/opt/sonar-scanner/conf/sonar-project.properties \
    sonarsource/sonar-scanner-cli
