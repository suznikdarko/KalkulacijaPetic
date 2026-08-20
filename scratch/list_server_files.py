import os

path = r"\\server-2012\SIMON"
if os.path.exists(path):
    print("Folder exists! Listing contents:")
    try:
        for item in os.listdir(path):
            print(item)
    except Exception as e:
        print(f"Error listing folder: {e}")
else:
    print(f"Folder {path} does not exist or is not accessible.")
