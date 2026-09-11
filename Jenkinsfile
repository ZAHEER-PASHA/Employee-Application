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

        stage('Test') {
            steps {
                bat 'cd backend\\employee-app && mvnw.cmd test'
            }
        }
    }
}