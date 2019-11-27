#!/bin/bash

if not exist SME19_fork\ (
echo 'getting a fork!'
git clone https://github.com/flamegiraffe/SME19_fork.git
) else (
echo 'already have a fork'
)