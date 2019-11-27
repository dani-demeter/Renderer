pipeline {
    agent { docker { image 'node:6.3' } }
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
			sh 'cd SME19_fork'
			sh 'cd SME19_fork'
			sh 'ls'
			sh 'cd workspace_implementation'
			sh 'java -jar FromEclipse.jar'
		}
	}
    }
}
