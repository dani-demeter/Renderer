#!/bin/bash

if [ ! -d "$SME19_fork" ]; then
  	git clone https://github.com/flamegiraffe/SME19_fork.git
	echo 'getting a fork!'
   else
	echo 'already got a fork'
fi