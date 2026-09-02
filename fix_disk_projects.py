with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re

old_func = '''        async function refreshDiskProjects() {
            if (!g_projectsDirHandle) return;
            g_diskProjects = [];
            try {
                for await (const entry of g_projectsDirHandle.values()) {
                    if (entry.kind === 'file' && entry.name.endsWith('.json')) {
                        g_diskProjects.push(entry);
                    }
                }
            } catch (err) { console.error(err); }
            extractCustomersFromDisk();
        }'''

new_func = '''        async function refreshDiskProjects() {
            if (!g_projectsDirHandle) return;
            g_diskProjects = [];
            try {
                for await (const entry of g_projectsDirHandle.values()) {
                    // FILTER ONLY KUVERTE PROJECTS
                    if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.kuverte.json')) {
                        g_diskProjects.push(entry);
                    }
                }
            } catch (err) { console.error(err); }
            extractCustomersFromDisk();
        }'''

if old_func in html:
    html = html.replace(old_func, new_func)
    with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Fixed refreshDiskProjects successfully")
else:
    print("Could not find refreshDiskProjects old func")
