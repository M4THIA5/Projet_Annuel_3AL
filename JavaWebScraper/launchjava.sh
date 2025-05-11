find ./ -type f -name "cli*.jar" > var
test="$(cat var)"
rm var
java -jar $test "$1"
