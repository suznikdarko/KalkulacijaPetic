import re

def fix_syncWithFolder(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
    if 'setHandleInIndexedDB(g_projectsDirHandle' in content:
        print(f"Already injected in {filepath}")
        return

    # Zamenjaj v syncWithFolder()
    old_code = """g_projectsDirHandle = await window.showDirectoryPicker();
                await refreshDiskProjects();
                renderSavedProjects();
                alert("Mapa uspešno povezana!");"""
                
    new_code = """g_projectsDirHandle = await window.showDirectoryPicker();
                await setHandleInIndexedDB(g_projectsDirHandle, 'pola_dir_handle');
                await refreshDiskProjects();
                renderSavedProjects();
                alert("Mapa uspešno povezana in shranjena!");"""

    content = content.replace(old_code, new_code)
    
    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

fix_syncWithFolder(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_syncWithFolder(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
