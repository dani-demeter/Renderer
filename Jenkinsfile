pipeline {
    agent { docker { image 'node:6.3' } }
    environment {java_cmd = $(which java)}
    stages {
        stage('fork') {
        	steps {
			sh 'echo "this is from the jenkinsfile"'
			sh 'bash buildbash.sh'
            	}
        }
	stage('test') {
		steps{
			sh 'echo "starting testing stage"'
			sh 'java_cmd -jar SME19_Fork/workspace_implementation/FromEclipse.jar'
		}
	}
    }
}
