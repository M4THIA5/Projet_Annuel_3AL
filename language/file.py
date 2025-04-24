# -*- coding: utf-8 -*-
import os
import pathlib as pathlib

import ply.lex as lex
import ply.yacc as yacc

PATH = pathlib.Path(__file__).parent.resolve()

reserved = {
    'select': 'SELECT',
    'insert': 'INSERT',
    'update': 'UPDATE',
    'delete': 'DELETE',
    'print': 'PRINT',
    'into': 'INTO',
    'create': 'CREATE',
    'where': 'WHERE',
    'search': 'SEARCH',
    'with': 'WITH'
}

tokens = ['NUMBER', 'MINUS', 'PLUS', 'TIMES', 'DIVIDE',
          'LPAREN', 'RPAREN', 'AND', 'OR', 'SEMI', 'NAME',
          'EQUAL', 'GT', 'LT', 'GTE', 'LTE', 'DEQUAL',
          'ACCDEB', 'ACCFERM', 'INC', 'DEC',
          'CRDEB', 'CRFIN', 'VIR', 'NOTEQUAL', 'POINT',
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


def t_into(t):
    r'into'
    t.type = reserved.get(t.value, 'INTO')
    return t


def t_search(t):
    r'search'
    t.type = reserved.get(t.value, 'SEARCH')
    return t


def t_with(t):
    r'with'
    t.type = reserved.get(t.value, 'WITH')
    return t


def t_where(t):
    r'where'
    t.type = reserved.get(t.value, 'WHERE')
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


def eval_expr(tree):
    if isinstance(tree, int) or isinstance(tree, float):
        return tree
    elif tree[0] == '+':
        return eval_expr(tree[1]) + eval_expr(tree[2])
    elif tree[0] == '*':
        return eval_expr(tree[1]) * eval_expr(tree[2])
    elif tree[0] == '-':
        return eval_expr(tree[1]) - eval_expr(tree[2])
    elif tree[0] == '/':
        return eval_expr(tree[1]) / eval_expr(tree[2])
    elif tree[0] == '<':
        return eval_expr(tree[1]) < eval_expr(tree[2])
    elif tree[0] == '>':
        return eval_expr(tree[1]) > eval_expr(tree[2])
    elif tree[0] == '<=':
        return eval_expr(tree[1]) <= eval_expr(tree[2])
    elif tree[0] == '>=':
        return eval_expr(tree[1]) >= eval_expr(tree[2])
    elif tree[0] == '==':
        return eval_expr(tree[1]) == eval_expr(tree[2])
    else:
        return tree


def eval_inst(t):
    if t[0] == 'empty' or t == 'empty':
        return
    elif t[0] == 'print':
        print(eval_expr(t[1]))
    elif t[0] == 'insert':
        f = pathlib.Path(PATH / t[1])
        if not f.exists():
            print("File does not exist")
            return
        try:
            with open(PATH / t[2], "a") as file:
                file.write(str(t[1]) + '\n')
        except FileNotFoundError:
            print("File not found")
    elif t[0] == 'create':
        f = pathlib.Path(PATH / t[1])
        if f.exists():
            print("File exists already")
            return
        open(PATH / t[1], "w")
    elif t[0] == 'delete':
        f = pathlib.Path(PATH / t[1])
        if not f.exists():
            print("File does not exist")
            return
        try:
            os.remove(PATH / t[1])
        except FileNotFoundError:
            print("File not found")
    elif t[0] == 'update':
        try:
            f = pathlib.Path(PATH / t[1])
            if not f.exists():
                print("File does not exist")
                return
            with open(PATH / t[1], "w") as file:
                file.write(str(t[2]) + '\n')
        except FileNotFoundError:
            print("File not found")
    elif t[0] == 'select':
        try:
            f = pathlib.Path(PATH / t[1])
            if not f.exists():
                print(f"File {t[1]} does not exist")
            else:
                print(f"File {t[1]} exists")
        except FileNotFoundError:
            print("File not found")
    elif t[0] == 'selectw':
        print("Select:", t[1])  # TODO
    elif t[0] == 'search':
        print("1")
        os.system("cd app/ && mvn clean compile --quiet --log-file ./log")
        print("2")
        os.system(
            " cd app && mvn exec:java --quiet --log-file ./log -Dexec.mainClass=\"app.src.main.java.fr.laporteacote.javawebscraper.Main\" -Dexec.args=\"" +
            t[1] + "\" 1> return.txt")
    elif t[0] == "statement":
        eval_inst(t[1])
        eval_inst(t[2])
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
        p[0] = ('statement', p[1], 'empty')
    else:
        p[0] = ('statement', p[1], p[2])


def p_statement(p):
    '''statement : insert_statement
    | select_statement
    | print_statement
    | create_statement
    | update_statement
    | delete_statement
    | search_statement'''
    p[0] = p[1]


def p_delete_statement(p):
    '''delete_statement : DELETE NAME SEMI'''
    p[0] = ('delete', p[2])


def p_search_statement(p):
    '''search_statement : SEARCH NAME SEMI'''
    p[0] = ('search', p[2])


def p_create_statement(p):
    '''create_statement : CREATE NAME SEMI'''
    p[0] = ('create', p[2])


def p_update_statement(p):
    '''update_statement : UPDATE NAME WITH expression SEMI'''
    p[0] = ('update', p[2], p[4])


def p_insert_statement(p):
    '''insert_statement : INSERT expression INTO NAME SEMI'''
    p[0] = ('insert', p[2], p[4])


def p_print_statement(p):
    '''print_statement : PRINT expression SEMI'''
    p[0] = ('print', p[2])


def p_select_statement(p):
    '''select_statement : SELECT NAME SEMI
    | SELECT WHERE liste_condition SEMI'''
    if len(p) == 5:
        p[0] = ('selectw', p[2], p[3])
    else:
        p[0] = ('select', p[2])


def p_list_condition(p):
    '''liste_condition : liste_condition boolean_operator condition
        | condition'''
    p[0] = ('listeconditions', [1])


def p_boolean_operator(p):
    '''boolean_operator : AND
                        | OR'''
    p[0] = p[1]


def p_condition(p):
    '''condition : prop EQUAL expression
                 | prop GT expression
                 | prop LT expression
                 | prop GTE expression
                 | prop LTE expression
                 | prop DEQUAL expression
                 | prop NOTEQUAL expression'''
    p[0] = ('condition', p[1], p[2], p[3])


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
        p[0] = (p[2], p[1], p[3])
    else:
        p[0] = p[1]


def p_error(p):
    print(p)
    print("Syntax error in input!")


yacc.yacc()
s: str = input('calc > ')
yacc.parse(s)
