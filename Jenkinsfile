pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend') {
            steps {
                bat 'cd backend\\employee-app && mvnw.cmd clean package -DskipTests'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker compose build'
            }
        }
        stage('Deploy') {
            steps {
                bat 'docker compose up -d'
            }
        }
        stage('Health Check') {
            steps {
                bat 'timeout /t 10 /nobreak'
                bat 'curl -f http://localhost:8081/api/health'
            }
        }
    }
}