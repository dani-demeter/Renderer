pipeline {
    agent { docker { image 'node:6.3' } }
    stages {
        stage('build') {
            steps {
		sh 'echo "this is from the jenkinsfile"'
		bash "buildbash.sh"
            }
        }
    }
}
