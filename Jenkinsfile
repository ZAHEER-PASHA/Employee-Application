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
                powershell 'Start-Sleep -Seconds 10'
                bat 'curl -f http://localhost:8081/api/health'
            }
        }
        stage('Send to Dashboard') {
            steps {
                bat '''
                curl -X POST http://localhost:8082/api/pipelines ^
                -H "Content-Type: application/json" ^
                -d "{\"buildNumber\":1,\"status\":\"SUCCESS\",\"branch\":\"main\",\"commitId\":\"test\",\"duration\":10,\"deploymentStatus\":\"SUCCESS\",\"application\":\"Employee App\",\"environment\":\"Development\",\"version\":\"v1.0\",\"deployedBy\":\"Jenkins\",\"dockerStatus\":\"RUNNING\",\"serverStatus\":\"HEALTHY\",\"terraformStatus\":\"N/A\"}"
                '''
            }
        }
    }
}