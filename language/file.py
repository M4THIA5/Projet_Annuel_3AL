# -*- coding: utf-8 -*-
import sys

import ply.yacc as yacc
import ply.lex as lex



reserved = {
    'say': 'PRINT',
    'if': 'IF',
    'while': "WHILE",
    'for': 'FOR',
    'elif': 'ELIF',
    'else': 'ELSE',
    'fun': 'FUNCTION',
    'ckoa': 'INPUT',
    'plzdo': 'CALL',
    'return': 'RETURN',
    'class': 'CLASS',
    'new': 'NEW',
    # 'prints' : 'PRINTSTRING'
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


def t_if(t):
    r'if'
    t.type = reserved.get(t.value, 'IF')
    return t


def t_while(t):
    r'while'
    t.type = reserved.get(t.value, 'WHILE')
    return t


def t_for(t):
    r'for'
    t.type = reserved.get(t.value, 'FOR')
    return t


def t_elif(t):
    r'elif'
    t.type = reserved.get(t.value, 'ELIF')
    return t


def t_else(t):
    r'else'
    t.type = reserved.get(t.value, 'ELSE')
    return t


def t_return(t):
    r'return'
    t.type = reserved.get(t.value, 'RETURN')
    return t


def t_fun(t):
    r'fun'
    t.type = reserved.get(t.value, 'FUNCTION')
    return t

def t_class(t):
    r'class'
    t.type = reserved.get(t.value, 'CLASS')
    return t

def t_new(t):
    r'new'
    t.type = reserved.get(t.value, 'NEW')
    return t


def t_input(t):
    r'ckoa'
    t.type = reserved.get(t.value, 'INPUT')
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


lex.lex()

def p_start(p):
    '''start : statement_list'''
    p[0] = p[1]

def p_statements(p):
    '''statement_list : statement_list statement
                      | statement'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = p[1] + [p[2]]

def p_statement(p):
    '''statement : insert_statement
    | select_statement'''
    p[0] = p[1]
def p_insert_statement(p):
    '''insert_statement : PRINT LPAREN expression RPAREN SEMI'''
    p[0] = p[1:]

def p_select_statement(p):
    '''select_statement : FUNCTION LPAREN expression RPAREN SEMI'''
    p[0] = p[1:]
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
