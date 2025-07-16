
from parser import parser, source_lines
from lexer import lexer
from functions import setup

if __name__ == '__main__':
    setup()
    code = input(">>> ")
    source_lines[:] = code.split('\n')
    parser.parse(code, lexer=lexer)