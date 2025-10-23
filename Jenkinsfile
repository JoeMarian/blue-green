pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'joemarina'
        IMAGE_NAME = 'node-bluegreen'
    }

    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/JoeMarian/blue-green'
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
                    def BLUE = sh(script: "docker ps -q -f name=blue", returnStdout: true).trim()
                    def GREEN = sh(script: "docker ps -q -f name=green", returnStdout: true).trim()

                    if (BLUE) {
                        echo "Blue is active. Deploying Green..."
                        sh '''
                        docker stop green || true
                        docker rm green || true
                        docker run -d -p 8082:3000 -e APP_COLOR=green --name green $DOCKERHUB_USER/$IMAGE_NAME:latest
                        '''
                        echo "Switch traffic to GREEN environment"
                        sh 'docker stop blue && docker rm blue'
                    } else {
                        echo "Green is active. Deploying Blue..."
                        sh '''
                        docker stop blue || true
                        docker rm blue || true
                        docker run -d -p 8081:3000 -e APP_COLOR=blue --name blue $DOCKERHUB_USER/$IMAGE_NAME:latest
                        '''
                        echo "Switch traffic to BLUE environment"
                        sh 'docker stop green && docker rm green'
                    }
                }
            }
        }
    }
}
