#/bin/bash

BASE_URL=http://archive.luftdaten.info
TMP_FILE=index.html
DATE=`date -d '1 day ago' +%Y-%m-%d`
URL="$BASE_URL/$DATE"

wget -O $TMP_FILE $URL

grep -Po '(?<=href=")[^"]*' $TMP_FILE | while read -r line ; do
    #echo "Processing $line"
    wget -O $line "$URL/$line"
done

rm $TMP_FILE
