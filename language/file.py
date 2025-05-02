# -*- coding: utf-8 -*-
import os
import pathlib as pathlib
import stat
from datetime import datetime

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
    'with': 'WITH',
    'in': 'IN',
    'dir': "DIR",
    'file': "FILE",
    "startsw": "STARTSW",
    "like": "LIKE",
    "endsw": "ENDSW",
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


def t_in(t):
    r'in'
    t.type = reserved.get(t.value, 'IN')
    return t


def t_dir(t):
    r'dir'
    t.type = reserved.get(t.value, 'DIR')
    return t


def t_file(t):
    r'file'
    t.type = reserved.get(t.value, 'FILE')
    return t


def t_startsw(t):
    r'startsw'
    t.type = reserved.get(t.value, 'STARTSW')
    return t


def t_like(t):
    r'like'
    t.type = reserved.get(t.value, 'LIKE')
    return t


def t_endsw(t):
    r'endsw'
    t.type = reserved.get(t.value, 'ENDSW')
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


properties = ["name", "atime", "mtime", "ctime", "type", "size", "content"]


def resolveProp(param, elem, PATH):
    if param not in properties:
        print("Unknown property '%s'\nAllowed properties :" % param)
        for p in properties:
            print("\t%s" % p)
        exit(1)
    stats = os.stat(PATH / elem)
    if param == "name":
        return elem
    elif param == "type":
        if stat.S_ISREG(os.stat(elem).st_mode):
            return "file"
        elif stat.S_ISDIR(os.stat(elem).st_mode):
            return "dir"
    elif param == "atime":
        # return datetime.fromtimestamp(stats.st_atime)
        return stats.st_atime
    elif param == "ctime":
        # return datetime.fromtimestamp(stats.st_ctime)
        return stats.st_ctime
    elif param == "mtime":
        # return datetime.fromtimestamp(stats.st_mtime)
        return stats.st_mtime
    elif param == "size":
        return os.path.getsize(PATH / elem)
    elif param == 'content':
        try:
            if stat.S_ISREG(os.stat(elem).st_mode):
                f = open(PATH / elem)
                c = f.read()
                f.close()
                return c
            else:
                return ""
        except IOError:
            print("File '%s' not found." % elem)
            exit(1)


def eval_cond(tree, elem, PATH):
    if tree[0] == '<':
        return resolveProp(tree[1], elem, PATH) < eval_expr(tree[2])
    elif tree[0] == '>':
        return resolveProp(tree[1], elem, PATH) > eval_expr(tree[2])
    elif tree[0] == '<=':
        return resolveProp(tree[1], elem, PATH) <= eval_expr(tree[2])
    elif tree[0] == '>=':
        return resolveProp(tree[1], elem, PATH) >= eval_expr(tree[2])
    elif tree[0] == '==':
        return resolveProp(tree[1], elem, PATH) == eval_expr(tree[2])
    elif tree[0] == '!=':
        return resolveProp(tree[1], elem, PATH) != eval_expr(tree[2])
    elif tree[0] == "startsw":
            return resolveProp(tree[1], elem, PATH).startswith(str(eval_expr(tree[2])))
    elif tree[0] == "like":
        return (str(eval_expr(tree[2]))) in resolveProp(tree[1], elem, PATH)
    elif tree[0] == "endsw":
            return resolveProp(tree[1], elem, PATH).endswith(str(eval_expr(tree[2])))
    else:
        return tree


def checkup(property, value, operator):
    if property == "type" and value not in ['file', 'dir']:
        return False
    if property == "atime" and value != int(value):
        return False
    if property == "ctime" and value != int(value):
        return False
    if property == "mtime" and value != int(value):
        return False
    if property == "size" and value != int(value):
        return False
    if operator == 'startsw' and (property != 'name' and property != 'content'):
        return False
    if operator == 'like' and (property != 'name' and property != 'content'):
        return False
    if operator == 'endsw' and (property != 'name' and property != 'content'):
        return False
    return True

def printStatData(stats, pa):
    if stat.S_ISREG(stats.st_mode):
        print("Is a file")
    if stat.S_ISDIR(stats.st_mode):
        print("Is a Directory")
        print("Directory contents:")
        for elem in os.listdir(PATH / pa):
            print("-", elem)
    print("Permissions :", stat.filemode(stats.st_mode))
    print("Size :", human_size(stats.st_size), f"({stats.st_size})")
    dt = datetime.fromtimestamp(stats.st_ctime)  # convert from epoch timestamp to datetime
    dt_str = datetime.strftime(dt, "%a %d %b %H:%M:%S %Y")  # format the datetime
    print("Created on :", dt_str)
    dt = datetime.fromtimestamp(stats.st_mtime)  # convert from epoch timestamp to datetime
    dt_str = datetime.strftime(dt, "%a %d %b %H:%M:%S %Y")  # format the datetime
    print("Last Modified on :", dt_str)
    dt = datetime.fromtimestamp(stats.st_atime)  # convert from epoch timestamp to datetime
    dt_str = datetime.strftime(dt, "%a %d %b %H:%M:%S %Y")  # format the datetime
    print("Last accessed on :", dt_str)




def isValid(elem, param, PATH):
    # 2 cas : si condition, ou liste condition
    # print(param)
    if param[0] == 'condition':
        # print("condition : if", param[1], param[2], param[3])
        if not checkup(param[1], param[3], param[2]):
            print("Invalid condition")
            exit(1)
        if eval_cond((param[2], param[1], param[3]), elem, PATH):
            return True
        else:
            return False
    elif param[0] == 'liste_conditions':
        # print("liste_conditions : if", param[1], param[2], param[3])
        if param[2] == "|":
            if isValid(elem, param[1], PATH) or isValid(elem, param[3], PATH):
                return True
            else:
                return False
        elif param[2] == "&":
            if isValid(elem, param[1], PATH) and isValid(elem, param[3], PATH):
                return True
            else:
                return False
    pass


def filterConds(PATH, param):
    for elem in os.listdir(PATH):
        if isValid(elem, param, PATH):
            print(elem, end='    ')


def filterCondsWithType(path, param, elementType):
    if elementType == "dir":
        for elem in os.listdir(path):
            if stat.S_ISDIR(os.stat(path / elem).st_mode) and isValid(elem, param, path):
                print(elem, end='    ')
    elif elementType == "file":
        for elem in os.listdir(path):
            if stat.S_ISREG(os.stat(path / elem).st_mode) and isValid(elem, param, path):
                print(elem, end='    ')
def calculate(t):
    sum = 0
    for elem in t:
        if elem == 'select':
            continue
        if type(elem) == tuple and type(elem[0]) == int:
            sum += elem[0]
    return sum


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
        calc = calculate(t)
        # print(calc)
        if calc < 0:
            elem = t[1][1].replace('"', '')
            try:
                printStatData(os.stat(PATH / elem), elem)
            except FileNotFoundError:
                print(elem, ": No such file or directory")
        elif calc == 0:
            for elem in os.listdir(PATH):
                print(elem, end='    ')
        elif calc == 1:
            check = t[1][1]
            if check == "dir":
                for elem in os.listdir(PATH):
                    if stat.S_ISDIR(os.stat(PATH / elem).st_mode):
                        print(elem, end='    ')
            elif check == "file":
                for elem in os.listdir(PATH):
                    if stat.S_ISREG(os.stat(PATH / elem).st_mode):
                        print(elem, end='    ')
        elif calc == 2:
            path = PATH / t[2][1].replace('"', '')
            try:
                for elem in os.listdir(path):
                    print(elem, end='    ')
            except FileNotFoundError:
                print(path, ": No such way to access")
        elif calc == 3:
            check = t[1][1]
            path = PATH / t[2][1].replace('"', '')
            try:
                if check == "dir":
                    for elem in os.listdir(path):
                        if stat.S_ISDIR(os.stat(path / elem).st_mode):
                            print(elem, end='    ')
                elif check == "file":
                    for elem in os.listdir(path):
                        if stat.S_ISREG(os.stat(path / elem).st_mode):
                            print(elem, end='    ')
            except FileNotFoundError:
                print(path, ": No such way to access")
        elif calc == 4:
            filterConds(PATH, t[2][1])
        elif calc == 5:
            filterCondsWithType(PATH, t[2][1], t[1][1])
        elif calc == 6:
            print(t[2][1][1])
            filterConds(PATH / t[2][1][1].replace('"', ''), t[2][1][1])
        elif calc == 7:
            filterCondsWithType(PATH / t[2][1][1].replace('"', ''), t[2][1][1], t[1][1])
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


def human_size(bytes, units=None):
    """ Returns a human-readable string representation of bytes """
    if units is None:
        units = [' bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
    return str(bytes) + units[0] if bytes < 1024 else human_size(bytes >> 10, units[1:])


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


def p_new_select(p):
    '''select_statement : SELECT selector params SEMI'''
    p[0] = ('select', p[2], p[3])


def p_selector(p):
    '''selector : NAME
    | TEXT
    | type
    | empty
    '''
    if p[1] in ["file", "dir"]:
        p[0] = (1, p[1])
    elif p[1] != None:
        p[0] = (-0xffffff, p[1])
    else:
        p[0] = (0, p[1])


def p_params(p):
    '''params : in_clause where_clause
    | in_clause
    | where_clause
    | empty'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = (6, p[1], p[2])


def p_in_clause(p):
    '''in_clause : IN TEXT
    | IN NAME
    | empty'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = (2, p[2])


def p_where_clause(p):
    '''where_clause : WHERE liste_condition
    | empty'''
    if len(p) == 2:
        p[0] = p[1]
    else:
        p[0] = (4, p[2])


def p_type(p):
    '''type : DIR
            | FILE'''
    p[0] = p[1]


def p_list_condition(p):
    '''liste_condition : liste_condition boolean_operator condition
        | condition'''
    if len(p) > 2:
        p[0] = ('liste_conditions', p[1], p[2], p[3])
    else:
        p[0] = p[1]


def p_boolean_operator(p):
    '''boolean_operator : AND
                        | OR'''
    p[0] = p[1]


def p_condition(p):
    '''condition : NAME GT result
                 | NAME LT result
                 | NAME GTE result
                 | NAME LTE result
                 | NAME DEQUAL result
                 | NAME NOTEQUAL result
                 | NAME STARTSW result
                 | NAME LIKE result
                 | NAME ENDSW result'''
    p[0] = ('condition', p[1], p[2], p[3])


def p_empty(p):
    '''empty :'''
    pass


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


def p_prop(p):
    '''result : NUMBER
            | NAME
            | type
             '''
    p[0] = p[1]


def p_error(p):
    print(p)
    print("Syntax error in input!")


yacc.yacc()
s: str = input('calc > ')
yacc.parse(s)
