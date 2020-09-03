import os
import os
import zipfile


os.chdir("client")  # Change directory to client
os.system('npm run build')  # Building vue project

os.chdir("../server")

os.system("pip3 freeze > requirements.txt")  # Creating requirements.txt
os.chdir("..")

# Creating zip archive with 
zf = zipfile.ZipFile("build.zip", "w")
for dirname, subdirs, files in os.walk("server"):
    if ".vscode" not in dirname and "pycache" not in dirname:
        for filename in files:
            if ".sqlite" not in filename:
                file_path = os.path.join(dirname, filename)
                out_path = file_path.replace("server", "")  # no subfolder in archive
                zf.write(file_path, out_path)
zf.close()