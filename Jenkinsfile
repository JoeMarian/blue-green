pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'joemarina'
        IMAGE_NAME = 'node-bluegreen'
        BLUE_PORT = '8081'
        GREEN_PORT = '8082'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/JoeMarian/blue-green.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKERHUB_USER/$IMAGE_NAME:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([string(credentialsId: 'dockerhub-token', variable: 'DOCKERHUB_PASS')]) {
                    sh 'echo $DOCKERHUB_PASS | docker login -u $DOCKERHUB_USER --password-stdin'
                    sh 'docker push $DOCKERHUB_USER/$IMAGE_NAME:latest'
                }
            }
        }

        stage('Deploy Blue-Green') {
            steps {
                script {
                    // Detect which container is running
                    def BLUE = sh(script: "docker ps -q -f name=blue", returnStdout: true).trim()
                    def GREEN = sh(script: "docker ps -q -f name=green", returnStdout: true).trim()

                    if (BLUE) {
                        echo "Blue is active. Deploying Green..."
                        sh """
                            docker stop green || true
                            docker rm green || true
                            docker run -d -p $GREEN_PORT:3000 -e APP_COLOR=green --name green $DOCKERHUB_USER/$IMAGE_NAME:latest
                            docker stop blue || true
                            docker rm blue || true
                        """
                        echo "Switched traffic to GREEN environment"
                    } else {
                        echo "Green is active or nothing running. Deploying Blue..."
                        sh """
                            docker stop blue || true
                            docker rm blue || true
                            docker run -d -p $BLUE_PORT:3000 -e APP_COLOR=blue --name blue $DOCKERHUB_USER/$IMAGE_NAME:latest
                            docker stop green || true
                            docker rm green || true
                        """
                        echo "Switched traffic to BLUE environment"
                    }
                }
            }
        }
    }
}
