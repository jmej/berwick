#!/bin/sh
# Starts node, jack and the berwick pd patch in that order
# Jesse Mejia / parallel.studio 2017

#put the following in /etc/rc.local
#/home/parallel/berwick/start_pd.sh || exit 1 #added by parallel
#exit 0

echo starting node

cd /home/parallel/berwick/server
forever start app.js localhost:9009 &&

cd /home/parallel/berwick

echo starting jack
qjackctl -s &

ech starting pd
pd main.pd

wait
