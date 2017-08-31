#!/bin/sh
# Starts node, jack and the berwick pd patch in that order
# Jesse Mejia / parallel.studio 2017

#put the following in /etc/rc.local
#/home/parallel/berwick/start_pd.sh &
#sudo chmod 755  /etc/rc.local


echo starting node

cd /home/parallel/berwick/server
forever start app.js localhost:9009 &

sleep 60
cd /home/parallel/berwick
#killing pulseaudio fixes some jack errors
killall pulseaudio &
sleep 5
qjackctl -s &
sleep 10
echo starting pd
pd main.pd

wait
