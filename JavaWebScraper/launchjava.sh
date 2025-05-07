find ./ -type f -name "cli*.jar" > var
test="$(cat var)"
java -jar $test "$1"
