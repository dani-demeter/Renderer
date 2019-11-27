#!/bin/bash

IF NOT EXIST SME19_fork\ (
echo 'getting a fork!'
git clone https://github.com/flamegiraffe/SME19_fork.git
) ELSE (
echo 'already have a fork'
)