# Create directories to store SonarQube configuration, data, logs and extensions.
mkdir -p ./opt/sonarqube/conf
mkdir -p ./opt/sonarqube/data
mkdir -p ./opt/sonarqube/logs
mkdir -p ./opt/sonarqube/extensions

# Sets the SONARQUBE_DIR environment variable with the absolute path of the previously created directory
export SONARQUBE_DIR=$(pwd)/opt

# Start a SonarQube Docker container
docker run --detach \
    -p 9000:9000 \
    -d \
    --name sonarqube \
    --rm \
    --stop-timeout 3600 \
    -v $SONARQUBE_DIR/conf:/opt/sonarqube/conf \
    -v $SONARQUBE_DIR/logs:/opt/sonarqube/data \
    -v $SONARQUBE_DIR/data:/opt/sonarqube/logs \
    -v $SONARQUBE_DIR/extensions:/opt/sonarqube/extensions \
sonarqube:8.7.1-community

# Message indicating that the SonarQube server is ready and display the IP address of the server in the Docker network.
echo " "
echo "###############"
echo "SONARQUBE Server is ready!"
echo "His IP address in docker network is $(docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' sonarqube)"
