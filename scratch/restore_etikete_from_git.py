import os
import zlib

workspace = r"c:\DARKO\KalkulacijaPetric"
git_objects_dir = os.path.join(workspace, ".git", "objects")

best_etikete_content = None
best_len = 0

for root, dirs, files in os.walk(git_objects_dir):
    for f in files:
        if len(f) == 38: # Hash filename
            obj_path = os.path.join(root, f)
            try:
                with open(obj_path, 'rb') as f_obj:
                    decompressed = zlib.decompress(f_obj.read())
                    if b'etikete.html' in decompressed or (b'Kalkulacija Stro' in decompressed and b'etikete' in decompressed.lower()):
                        text = decompressed.decode('utf-8', errors='ignore')
                        # Check if it's a full html file
                        if text.startswith('blob ') and '</html>' in text:
                            content = text[text.find('\x00')+1:]
                            if len(content) > best_len and len(content) < 500000:
                                best_len = len(content)
                                best_etikete_content = content
            except Exception:
                pass

if best_etikete_content:
    out_path = os.path.join(workspace, 'etikete.html')
    with open(out_path, 'w', encoding='utf-8') as f_out:
        f_out.write(best_etikete_content)
    print(f"SUCCESSFULLY RESTORED etikete.html from git objects! Size: {len(best_etikete_content)} chars")
else:
    print("Could not find etikete.html in git objects.")
