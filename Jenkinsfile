pipeline {
    agent any

    environment {
        START_TIME = "${System.currentTimeMillis()}"
        DEPLOYED_BY = "Jenkins"
        SERVER_STATUS = "UNKNOWN"
        DEPLOYMENT_STATUS = "NOT_DEPLOYED"
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
                script {
                    try {
                        bat 'docker compose up -d'
                        env.DEPLOYMENT_STATUS = "SUCCESS"
                    } catch (e) {
                        env.DEPLOYMENT_STATUS = "FAILURE"
                        throw e
                }
            }
        }
        }

        stage('Health Check') {
            steps {
                powershell 'Start-Sleep -Seconds 10'

                script {
                    def result = bat(
                        script: 'curl -f http://localhost:9999/api/health',
                        returnStatus: true
                    )

                    if (result == 0) {
                        env.SERVER_STATUS = "HEALTHY"
                    } else {
                        env.SERVER_STATUS = "UNHEALTHY"
                        error "Health check failed"
                    }
                }
            }
        }

        
        
    }
    post {
    always {
        script {
            echo "SERVER_STATUS = ${env.SERVER_STATUS}"
            echo "DEPLOYMENT_STATUS = ${env.DEPLOYMENT_STATUS}"
            echo "BUILD_RESULT = ${currentBuild.currentResult}"

            def dockerStatus = bat(
                script: 'docker compose ps --services --filter "status=running"',
                returnStdout: true
            ).trim()

            dockerStatus = dockerStatus ? "RUNNING" : "STOPPED"

            writeFile file: 'pipeline.json', text: """
{
    "buildNumber": ${env.BUILD_NUMBER},
    "status": "${currentBuild.currentResult}",
    "branch": "${env.GIT_BRANCH}",
    "commitId": "${env.GIT_COMMIT}",
    "buildTime": "${new Date(currentBuild.startTimeInMillis).format("yyyy-MM-dd'T'HH:mm:ss")}",
    "duration": ${(System.currentTimeMillis() - START_TIME.toLong()) / 1000},
    "deploymentStatus": "${env.DEPLOYMENT_STATUS}",
    "application": "Employee App",
    "environment": "Development",
    "version": "v1.${env.BUILD_NUMBER}",
    "deployedBy": "${env.DEPLOYED_BY}",
    "dockerStatus": "${dockerStatus}",
    "serverStatus": "${env.SERVER_STATUS}",
    "terraformStatus": "N/A"
}
"""

            bat 'curl -X POST http://localhost:8082/api/pipelines -H "Content-Type: application/json" --data-binary "@pipeline.json"'
        }
    }
}
}