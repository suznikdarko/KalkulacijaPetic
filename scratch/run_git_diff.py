import os
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

possible_paths = [
    r"C:\Program Files\Git\bin\git.exe",
    r"C:\Program Files\Git\cmd\git.exe",
    r"C:\Program Files (x86)\Git\bin\git.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Git\cmd\git.exe"),
    os.path.expandvars(r"%PROGRAMFILES%\Git\cmd\git.exe"),
    r"git.exe" # if in path
]

git_path = None
for p in possible_paths:
    if os.path.exists(p) or p == "git.exe":
        # test running it
        try:
            res = subprocess.run([p, "--version"], capture_output=True, text=True)
            if res.returncode == 0:
                git_path = p
                print(f"Found git at: {p} ({res.stdout.strip()})")
                break
        except Exception:
            continue

if not git_path:
    print("Could not find git.exe on the system.")
    sys.exit(1)

# Run git diff
try:
    res = subprocess.run([git_path, "diff", "blok.html"], capture_output=True, text=True, encoding='utf-8')
    print("Git Diff for blok.html:")
    print(res.stdout)
except Exception as e:
    print(f"Error running git diff: {e}")
