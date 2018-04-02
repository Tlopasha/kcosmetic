#!/bin/bash
echo $(pwd)
HOST=officefibo.dynu.net
PORT=48823
H_USER=fibo
ARTIFACTS_DIR="/home/$H_USER/artifacts"
APP_NAME=credit-score

echo "Deploying on server $HOST:$PORT"
mkdir -p ~/.ssh
ssh-keyscan -p $PORT -H $HOST >> ~/.ssh/known_hosts &&
scp -P $PORT ./dist/$APP_NAME.tar.gz $H_USER@$HOST:$ARTIFACTS_DIR &&
ssh -t -p $PORT $H_USER@$HOST "/home/$H_USER/tools/deploy.sh $APP_NAME 8080" &&
echo "Deployed!!"
