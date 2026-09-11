pipeline {
    agent any
    environment {
    START_TIME = "${System.currentTimeMillis()}"
    }

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
        writeFile file: 'pipeline.json', text: """
{
    "buildNumber": ${env.BUILD_NUMBER},
    "status": "SUCCESS",
    "branch": "${env.GIT_BRANCH}",
    "commitId": "${env.GIT_COMMIT}",
    "buildTime": "${new Date(currentBuild.startTimeInMillis).format('yyyy-MM-dd\'T\'HH:mm:ss')}",
    "duration": ${(System.currentTimeMillis() - START_TIME.toLong()) / 1000},
    "deploymentStatus": "SUCCESS",
    "application": "Employee App",
    "environment": "Development",
    "version": "v1.${env.BUILD_NUMBER}",
    "deployedBy": "Jenkins",
    "dockerStatus": "RUNNING",
    "serverStatus": "HEALTHY",
    "terraformStatus": "N/A"
}
"""
        bat 'curl -X POST http://localhost:8082/api/pipelines -H "Content-Type: application/json" --data-binary "@pipeline.json"'
    }
}
    }
}