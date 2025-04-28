pipeline {
    agent any

    environment {
        FRONTEND_IMAGE = 'devops-frontend'
        BACKEND_IMAGE = 'devops-backend'
    }

    stages {
        stage('Build Frontend') {
            steps {
                script {
                    // Build the frontend Docker image
                    echo 'Building Frontend...'
                    bat 'docker build -t devops-frontend ./frontend'
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    // Build the backend Docker image
                    echo 'Building Backend...'
                    bat 'docker build --no-cache -t devops-backend ./backend'
                }
            }
        }

    //     stage('Test Inside Backend Container') {
    //   steps {
    //     script {
    //       // Run the tests inside a disposable container
    //         echo 'Running tests inside Backend container...'
    //         sh """ docker run --rm   $BACKEND_IMAGE npm test """
    //     }
    //   }
    // }

        stage('Deploy Containers') {
            steps {
                script {
                    // Run Docker Compose to deploy
                    echo 'Deploying containers...'
                    bat 'docker-compose up -d --build --remove-orphans'
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline successfully completed!'
        }
        failure {
            echo 'CI/CD pipeline failed.'
        }
    }
}
