import ply.yacc as yacc

from language.lexer import tokens, reserved
from language.functions import eval_inst, find_column
source_lines = []

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
    | rename_statement
    | load_statement
    | search_statement
    | create_post_statement
    | see_exchanges_statement
    | gen_pdf_statement
    | help_statement'''
    p[0] = p[1]

def p_help_statement(p):
    '''help_statement : HELP SEMI
    | HELP SELECT SEMI
    | HELP INSERT SEMI
    | HELP UPDATE SEMI
    | HELP DELETE SEMI
    | HELP CREATE SEMI
    | HELP RENAME SEMI
    | HELP SEARCH SEMI
    | HELP PRINT SEMI
    | HELP CREATE POST SEMI
    | HELP SEE EXCHANGES SEMI
    | HELP CREATE PDF SEMI
    | HELP NAME SEMI
    | HELP LOAD SEMI
    | HELP TEXT SEMI
    '''
    if len(p) == 3:
        p[0] = ('help', None)
    else:
        p[0] = ('help', p[2:])


def p_delete_statement(p):
    '''delete_statement : DELETE NAME SEMI'''
    p[0] = ('delete', p[2])

def p_load_statement(p):
    '''load_statement : LOAD nt SEMI'''
    p[0] = ('load', p[2])
def p_nt(p):
    '''nt : TEXT
            | NAME
             '''
    p[0] = p[1]
def p_create_post_statement(p):
    '''create_post_statement : CREATE POST SEMI'''
    p[0] = ('create_post', None)


def p_see_exchanges_statement(p):
    '''see_exchanges_statement :  SEE EXCHANGES SEMI'''
    p[0] = ('see_exchanges', None)


def p_gen_pdf_statement(p):
    '''gen_pdf_statement : CREATE PDF typepdf SEMI'''
    p[0] = ('gen_pdf', p[3])

def p_typepdf(p):
    '''typepdf : DATA
               | SEARCH'''
    p[0] = p[1]

def p_search_statement(p):
    '''search_statement : SEARCH TEXT SEMI'''
    p[0] = ('search', p[2])


def p_create_statement(p):
    '''create_statement : CREATE dir NAME SEMI'''
    if p[2] == 'dir':
        p[0] = ('create', p[2], p[3])
    else:
        p[0] = ('create', p[3])


def p_update_statement(p):
    '''update_statement : UPDATE NAME WITH expression SEMI'''
    p[0] = ('update', p[2], p[4])


def p_rename_statement(p):
    '''rename_statement : RENAME dir NAME WITH expression SEMI'''
    if p[2] == 'dir':
        p[0] = ('rename', p[2], p[3], p[5])
    else:
        p[0] = ('rename', p[3], p[5])


def p_dir(p):
    '''dir : DIR
    | empty'''
    if p[1] == 'dir':
        p[0] = 'dir'


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
    if p:
        lineno = p.lineno
        col = find_column(p.lexer.lexdata, p)
        print(f"\033[91mSyntax error\033[0m on line {lineno}, column {col} : '{p.value}'")
        print("  " + source_lines[lineno - 1])
        print("  " + " " * (col - 1) + f"\033[91m"+"^"*len(p.value)+"\033[0m")
    else:
        print("\033[91mSyntax error : Unexpected end of file. Maybe a semicolumn is missing ?\033[0m")

parser =yacc.yacc()