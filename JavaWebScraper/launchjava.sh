#!/bin/bash

find ./ -type f -name "cli*.jar" > var
test="$(cat var)"
rm var
java.exe -jar $test "$1"
