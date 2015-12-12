
docker build --rm  -t sublink/sftp-sync .

APP=$(docker run -d -p 8080:8080 -v `pwd`:/data sublink/sftp-sync)

PORT=$(docker port $APP 8080 | awk -F: '{ print $2 }')

URL=$(docker-machine url default | awk -F// '{ print $2 }')
URL=$(echo $URL | awk -F: '{ print $1 }')
URL="http://$URL:8080"

echo Listening $URL $APP $PORT

# trap ctrl-c and call ctrl_c()
trap ctrl_c INT
RUN=true

function ctrl_c() {
  RUN=false
}

while [ "$RUN" = true ]; do
  sleep 1
done

echo Stopping
docker stop $APP && docker rm $APP
