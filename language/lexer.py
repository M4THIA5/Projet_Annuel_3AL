import ply.lex as lex

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
    'rename': "RENAME",
    "exchanges": "EXCHANGES",
    "pdf": "PDF",
    "post": "POST",
    "see": "SEE",
    "help": "HELP",
    'load': "LOAD",
    'data': "DATA",
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

def t_data(t):
    r'data'
    t.type = reserved.get(t.value, 'DATA')
    return t


def t_like(t):
    r'like'
    t.type = reserved.get(t.value, 'LIKE')
    return t

def t_load(t):
    r'load'
    t.type = reserved.get(t.value, 'LOAD')
    return t



def t_endsw(t):
    r'endsw'
    t.type = reserved.get(t.value, 'ENDSW')
    return t


def t_help(t):
    r'help'
    t.type = reserved.get(t.value, 'HELP')
    return t


def t_rename(t):
    r'rename'
    t.type = reserved.get(t.value, 'RENAME')
    return t


def t_name(t):
    r'[a-zA-Z_][a-zA-Z_0-9]*'
    t.type = reserved.get(t.value, 'NAME')
    return t


def t_TEXT(t):
    r'"[\(\)\[\]\w,éèàâêùëöÿäçô$*#&\/\\*\-+\s\.]*"'
    t.value = t.value
    return t


def t_error(t):
    print(f"\033[91mLexical error\033[0m on line {t.lineno} : unexpected character '{t.value[0]}'")
    t.lexer.skip(1)

def t_ccode_comment(t):
    r'(/\*(.|\n)*?\*/)|(//.*)'
    pass

lexer = lex.lex()