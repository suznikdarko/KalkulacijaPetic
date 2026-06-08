import re

def inject_indexeddb(filepath):
    try:
        with open(filepath, 'r', encoding='utf-16') as f:
            content = f.read()
    except Exception:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
    if 'function getHandleFromIndexedDB' in content:
        print(f"Already injected in {filepath}")
        return

    funcs = """
        function setHandleInIndexedDB(handle, key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('KalkulatorDB', 1);
                request.onupgradeneeded = e => {
                    e.target.result.createObjectStore('handles');
                };
                request.onsuccess = e => {
                    const db = e.target.result;
                    const tx = db.transaction('handles', 'readwrite');
                    const store = tx.objectStore('handles');
                    store.put(handle, key);
                    tx.oncomplete = () => resolve();
                    tx.onerror = () => reject(tx.error);
                };
                request.onerror = e => reject(e.target.error);
            });
        }

        function getHandleFromIndexedDB(key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('KalkulatorDB', 1);
                request.onupgradeneeded = e => {
                    e.target.result.createObjectStore('handles');
                };
                request.onsuccess = e => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains('handles')) return resolve(null);
                    const tx = db.transaction('handles', 'readonly');
                    const store = tx.objectStore('handles');
                    const getReq = store.get(key);
                    getReq.onsuccess = () => resolve(getReq.result);
                    getReq.onerror = () => reject(getReq.error);
                };
                request.onerror = e => reject(e.target.error);
            });
        }

        async function toggleProjectsDropdown() {"""

    content = content.replace("async function toggleProjectsDropdown() {", funcs)
    
    with open(filepath, 'w', encoding='utf-16') as f:
        f.write(content)
    print(f"Fixed {filepath}")

inject_indexeddb(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
inject_indexeddb(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
