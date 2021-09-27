# berwick

main component: pd patch that pulls audio from microphones in the space and/or processes archival recordings

ui: local webserver running on node for volume and muting ui on port 8080, the archived script seems to call 9009, not sure where this is actually running from but seems to be running on 8080 on prod

filesharing: 

pd does some loggging when microphone's are active - found in log.txt
reboot logs can be looked at with last -x reboot
synaccess manages system reboot behavior, settings are documented in /documentation in this repogit

system startup script is start_pd.sh in this repo and is run from ???

system shutdown is controlled by sudo crontab -e and shuts down at 1am each morning

on prod machine, things are being run from ~/berwick/