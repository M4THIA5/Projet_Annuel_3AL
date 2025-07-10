# -*- coding: utf-8 -*-
import json
import os
import pathlib as pathlib
import platform
import stat
import subprocess
from datetime import datetime

import requests
from fpdf import XPos, YPos, FPDF
import webbrowser

PATH = pathlib.Path(__file__).parent.resolve()

class PDF(FPDF):
    def header(self):
        # Setting font: helvetica bold 15
        self.set_font("helvetica", style="B", size=15)
        # Calculating width of title and setting cursor position:
        width = self.get_string_width(self.title) + 6
        self.set_x((210 - width) / 2)

        # Setting colors for frame, background and text:
        self.set_draw_color(255, 255, 255)
        self.set_fill_color(255, 255, 255)
        self.set_text_color(0, 0, 0)

        self.cell(
            width,
            9,
            self.title,
            border=1,
            new_x="LMARGIN",
            new_y="NEXT",
            align="C",
            fill=True,
        )
        # Performing a line break:
        self.ln(10)


def setup():
    if not os.path.exists(PATH):
        print("The path does not exist.")
        exit(1)
    if not os.access(PATH, os.R_OK | os.W_OK | os.X_OK):
        print("You do not have the necessary permissions to access this path.")
        exit(1)
    if not os.path.isdir(PATH):
        print("The path is not a directory.")
        exit(1)
    if not os.path.exists(PATH / 'launchjava.bat'):
        print("The required file 'launchjava.bat' does not exist in the specified path.")
        exit(1)
    if not os.access(PATH / 'launchjava.bat', os.R_OK | os.W_OK | os.X_OK):
        print("You do not have the necessary permissions to access 'launchjava.bat'.")
        exit(1)
    if not os.path.exists(PATH / 'pdfs'):
        os.mkdir(PATH / 'pdfs')
    if not os.access(PATH / 'pdfs', os.R_OK | os.W_OK | os.X_OK):
        os.chmod(PATH / 'pdfs', 0o755)
    if not os.path.exists(PATH / 'searches'):
        os.mkdir(PATH / 'searches')
    if not os.access(PATH / 'searches', os.R_OK | os.W_OK | os.X_OK):
        os.chmod(PATH / 'searches', 0o755)

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



def print_help(command=None):
    command = ' '.join(command[:-1]) if command else None
    if command == "select":
        print("Select statement allows you to retrieve or show data from a file in the file system.")
    elif command == "insert":
        print("Insert statement allows you to add data to a file.")
    elif command == "update":
        print("Update statement allows you to modify existing data in a file.")
    elif command == "delete":
        print("Delete statement allows you to remove data from a file.")
    elif command == "load":
        print("Load statement allows you to load commands written a file in the system.")
    elif command == "create":
        print("Create statement allows you to create files or directories.")
    elif command == "rename":
        print("Rename statement allows you to rename files or directories.")
    elif command == "search":
        print("Search statement allows you to search about a keyword and get information about it.")
    elif command == "print":
        print("Print statement allows you to display the contents of a file or the result of an expression.")
    elif command == "create post":
        print("Create post statement allows you to create a new post in the system. Authentication will be required.")
    elif command == "see exchanges":
        print("See exchanges statement allows you to view available exchange proposals in the system. Authentication will be required.")
    elif command == "create pdf":
        print("Generate PDF statement allows you to create a PDF document extracting data from the files present in the directory.")
    elif command is None:
        print("Help for all commands:")
        print("Available commands:")
        print("\tselect, insert, update, delete, print, load, create, rename, search, create post, see exchanges, create pdf")
        print("\tFor more information on a specific command, type 'help <command>'")
    else:
        print(f"Unknown command '{command}'. Type 'help' for a list of available commands.")

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
        if len(t) == 2:
            f = pathlib.Path(PATH / t[1])
            if f.exists():
                print("File exists already")
                return
            open(PATH / t[1], "w")
        else:
            d = pathlib.Path(PATH / t[2])
            try:
                os.makedirs(d)
            except FileExistsError:
                print(f"One or more directories in '{d}' already exist.")
    elif t[0] == 'delete':
        f = pathlib.Path(PATH / t[1])
        if not f.exists():
            print("File does not exist")
            return
        try:
            os.remove(PATH / t[1])
        except FileNotFoundError:
            print("File not found")
    elif t[0] == 'rename':
        if len(t) == 3:
            try:
                os.rename(t[1], t[2])
            except IOError:
                print("Rename failed")
        else:
            try:
                os.rename(t[2], t[3])
            except IOError:
                print("Rename failed")
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
        cmd = "where" if platform.system() == "Windows" else "which"
        test = subprocess.call([cmd, "launchjava.bat"], stdout=subprocess.DEVNULL,
                               stderr=subprocess.STDOUT)
        if test != 0:
            print("The executable doesn't exist. Please install our Java app.")
            exit(1)
        command = "launchjava.bat " + t[1]
        with os.popen(command) as process:
            output = process.read()
        print("Sortie Java:", output)
    elif t[0] == "statement":
        eval_inst(t[1])
        eval_inst(t[2])
    elif t[0]== 'create_post':
        data = input("What do you want to publish ? ")
        if not data:
            print("You must provide some data to create a post.")
            return
        try:
            create_post(data)
            print("Post created successfully.")
        except requests.exceptions.RequestException as e:
            print(f"Failed to create post: {e}")
    elif t[0]== 'see_exchanges':
        url = "https://laporteacote.online/troc"
        webbrowser.open(url)
    elif t[0]== 'gen_pdf':
        if t[1] == 'data':
            generate_data_pdf()
        elif t[1] == 'search':
            generate_search_pdf()
    elif t[0] == 'load':
        if len(t) < 2:
            print("No file specified to load commands from.")
            return
        file_path = PATH / t[1]
        if not file_path.exists():
            print(f"File '{file_path}' does not exist.")
            return
        try:
            with open(file_path, 'r') as file:
                commands = file.readlines()
            for command in commands:
                command = command.strip()
                if command:  # Skip empty lines
                    eval_inst(command.split())
        except Exception as e:
            print(f"Error loading commands from '{file_path}': {e}")
    elif t[0] == 'help':
        print_help(t[1] if len(t) > 1 else None)
    else:
        print("Unknown instruction:", t)

def generate_data_pdf():
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Helvetica", size=12)
    pdf.set_title("File Management System Report")
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("Helvetica", size=12, style="UBI")
    pdf.cell(0, 10, "Generated by the file management system", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, text="This PDF contains information about files in the current directory.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    for elem in os.listdir(PATH):
        pdf.set_title(elem)
        pdf.add_page()
        stats = os.stat(PATH / elem)
        pdf.cell(200, 10, text=f"{elem}",  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(200, 10, text=f"Size: {human_size(stats.st_size)} ({stats.st_size} bytes)",  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(200, 10, text=f"Type: {'Directory' if stat.S_ISDIR(stats.st_mode) else 'File'}",  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(200, 10, text=f"Created on: {datetime.fromtimestamp(stats.st_ctime)}",  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(200, 10, text=f"Last modified on: {datetime.fromtimestamp(stats.st_mtime)}",  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.cell(200, 10, text=f"Last accessed on: {datetime.fromtimestamp(stats.st_atime)}",  new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln()
        if stat.S_ISREG(stats.st_mode):
            try:
                with open(PATH / elem, "r") as file:
                    pdf.cell(200, 10, text="Content:", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
                    content = file.read()
                    pdf.multi_cell(0, 10, content)
            except Exception as e:
                pdf.cell(200, 10, text=f"File is not writable as text here.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", style="I", size=10)

    output_path = PATH / "pdfs"/ ("data_output_"+datetime.now().strftime("%Y-%m-%d_%H-%M-%S_%f")+".pdf")
    pdf.output(output_path)
    print(f"PDF generated at {output_path}")


def generate_search_pdf():
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.set_font("Helvetica", size=12)
    pdf.set_title("Searches Report")
    pdf.add_page()
    pdf.ln(10)
    pdf.set_font("Helvetica", size=12, style="UBI")
    pdf.cell(0, 10, "Generated by the file management system", align="C", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.set_font("Helvetica", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, text="This PDF contains information about files generated in the searches folder.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    if not os.path.exists(PATH / "searches") or not os.listdir(PATH / "searches"):
        pdf.cell(200, 10, text="No searches found.", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        output_path = PATH / "pdfs"/ ("search_output_"+datetime.now().strftime("%Y-%m-%d_%H-%M-%S_%f")+".pdf")
        pdf.output(output_path)
        print(f"PDF generated at {output_path}")
        return
    for elem in os.listdir(PATH / "searches"):
        pdf.set_title(elem)
        pdf.add_page()
        with open(PATH / "searches" / elem, "r") as file:
            content = file.read()
            pdf.multi_cell(0, 10, content)
    pdf.set_font("Helvetica", style="I", size=10)

    output_path = PATH / "pdfs"/ ("search_output_"+datetime.now().strftime("%Y-%m-%d_%H-%M-%S_%f")+".pdf")
    pdf.output(output_path)
    print(f"PDF generated at {output_path}")

def create_post(data): #TODo : fix this
    """ Creates a post by sending data to the server """
    url = "https://api.laporteacote.online/login"
    headers = {
        "Content-Type": "application/json",
    }
    payload = {
        "email": "user1@example.com",
        "password": "hashed_password",
    }
    response = requests.post(url, json=payload, headers=headers)
    text = json.loads(response.text)
    token = text.accessToken
    url = "https://api.laporteacote.online/users/me"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ token
    }
    response = requests.post(url, json=payload, headers=headers)
    text = json.loads(response.text)
    url = "https://api.laporteacote.online/post/create"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+ token
    }
    payload = {
        "userId":text.id,
        "neighborhoodId":text.userNeighborhoods[0].neighborhoodId,
        "content": data,
    }
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
    if response.status_code == 201:
        print("Post created successfully.")
    else:
        print(f"Failed to create post: {response.status_code} - {response.text}")

def human_size(bytes, units=None):
    """ Returns a human-readable string representation of bytes """
    if units is None:
        units = [' bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB']
    return str(bytes) + units[0] if bytes < 1024 else human_size(bytes >> 10, units[1:])

def find_column(input, token):
    last_cr = input.rfind('\n', 0, token.lexpos)
    if last_cr < 0:
        last_cr = -1
    return token.lexpos - last_cr
