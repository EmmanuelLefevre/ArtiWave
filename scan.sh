# Variables definition
export SONAR_HOST=172.17.0.2:9000
export SONAR_TOKEN=dd10b9ad5724c604dabde9b1f16026b89659b6b0
export REPO=$(pwd)
export CONFIG_FILE=$(pwd)/sonar-project.properties

# SonarQube scanner execution
docker run \
    # Delete container after execution
    --rm \
    # SonarQube server URL.
    -e SONAR_HOST_URL="http://${SONAR_HOST}" \
    # SonarQube scanner project key
    -e SONAR_SCANNER_OPTS="-Dsonar.projectKey=ArtiWave" \
    # Authentication token to connect to SonarQube server
    -e SONAR_LOGIN="${SONAR_TOKEN}" \
    # Mount the project directory into the container
    -v "${REPO}:/usr/src" \
    # Mount the SonarQube configuration file in the container
    -v "${CONFIG_FILE}:/opt/sonar-scanner/conf/sonar-project.properties" \
    # Docker image to use, in this case, the SonarQube scanner image
    sonarsource/sonar-scanner-cli
