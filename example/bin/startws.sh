if [ ! -f "pid" ]
then
    node ../lib/daemon.js ../lib/server.js ../conf/config.json &
    echo $! > pid
fi