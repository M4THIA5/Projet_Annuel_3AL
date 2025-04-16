# -*- coding: utf-8 -*-

import pathlib as pathlib

import ply.lex as lex
import ply.yacc as yacc

PATH = pathlib.Path(__file__).parent.resolve()

reserved = {
    'select' : 'SELECT',
    'insert': 'INSERT',
    'update': 'UPDATE',
    'delete': 'DELETE',
    'print': 'PRINT',
}

tokens = ['NUMBER', 'MINUS', 'PLUS', 'TIMES', 'DIVIDE',
          'LPAREN', 'RPAREN', 'AND', 'OR', 'SEMI', 'NAME',
          'EQUAL', 'GT', 'LT', 'GTE', 'LTE', 'DEQUAL',
          'ACCDEB', 'ACCFERM', 'INC', 'DEC',
          'CRDEB', 'CRFIN', 'VIR', 'NOTEQUAL','POINT',
          'TEXT'
          ] + list(reserved.values())

t_PLUS = r'\+'
t_INC = r'\+\+'
t_DEC = r'--'
t_MINUS = r'-'
t_TIMES = r'\*'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_AND = r'\&'
t_OR = r'\|'
t_SEMI = r';'
t_EQUAL = r'='
t_GT = r'>'
t_LT = r'<'
t_GTE = r'>='
t_LTE = r'<='
t_DEQUAL = r'=='
t_NOTEQUAL = r'!='
t_ACCDEB = r'{'
t_ACCFERM = r'}'
t_CRDEB = r'\['
t_CRFIN = r'\]'
t_VIR = r','
t_POINT = r'\.'
t_ignore = " \t"

def t_NUMBER(t):
    r'\-?\d+(\.\d+)?'
    if t.value.__contains__("."):
        t.value = float(t.value)
    else:
        t.value = int(t.value)
    return t


def t_newline(t):
    r'\n+'
    t.lexer.lineno += t.value.count("\n")


def t_print(t):
    r'print'
    t.type = reserved.get(t.value, 'PRINT')
    return t


def t_select(t):
    r'select'
    t.type = reserved.get(t.value, 'SELECT')
    return t


def t_insert(t):
    r'insert'
    t.type = reserved.get(t.value, 'INSERT')
    return t


def t_update(t):
    r'update'
    t.type = reserved.get(t.value, 'UPDATE')
    return t


def t_delete(t):
    r'delete'
    t.type = reserved.get(t.value, 'DELETE')
    return t

def t_name(t):
    r'[a-zA-Z_][a-zA-Z_0-9]*'
    t.type = reserved.get(t.value, 'NAME')
    return t

def t_TEXT(t):
    r'"[\(\)\[\]\w,éèàâêùëöÿäçô$*#&\/\\*\-+\s]*"'
    t.value = t.value
    return t

def t_error(t):
    print("Illegal character '%s'" % t.value[0])
    t.lexer.skip(1)


def t_ccode_comment(t):
    r'(/\*(.|\n)*?\*/)|(//.*)'
    pass

def eval_inst(t):
    if t[0] == 'PRINT':
        print(t[1])
    elif t[0] == 'INSERT':
        print("Insert called with argument:", t[2])
        with open(PATH / t[2]) as f:
            f = Path(f)
            if f.exists():
                print("File exists")
            else:
                f.write(str(t[2]) + '\n')
    elif t[0] == 'SELECT':
        print("Select:", t[2])
    else:
        print("Unknown instruction:", t)



lex.lex()

def p_start(p):
    '''start : statement_list'''
    p[0] = p[1]
    eval_inst(p[1])

def p_statements(p):
    '''statement_list : statement_list statement
                      | statement'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = p[1] + [p[2]]

def p_statement(p):
    '''statement : insert_statement
    | select_statement
    | print_statement'''
    p[0] = p[1]
def p_insert_statement(p):
    '''insert_statement : INSERT expression INTO NAME SEMI'''
    p[0] = ('INSERT', p[2], p[4])


def p_print_statement(p):
    '''print_statement : PRINT expression SEMI'''
    p[0] = ('PRINT', p[2])
def p_select_statement(p):
    '''select_statement : SELECT NAME SEMI'''
    p[0] = ('select', p[2])
def p_expression(p):
    '''expression : expression PLUS expression
                  | expression MINUS expression
                  | expression TIMES expression
                  | expression DIVIDE expression
                  | expression AND expression
                  | expression OR expression
                  | LPAREN expression RPAREN
                  | NUMBER
                  | NAME
                  | TEXT'''
    if len(p) == 4:
        p[0] = p[1] + p[2] + p[3]
    elif len(p) == 3:
        p[0] = p[2]
    else:
        p[0] = p[1]
def p_error(p):
    print(p)
    print("Syntax error in input!")


yacc.yacc()
s:str = input('calc > ')
yacc.parse(s)
