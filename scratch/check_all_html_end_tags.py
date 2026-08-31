import os

workspace = r"c:\DARKO\KalkulacijaPetric"
files = [f for f in os.listdir(workspace) if f.endswith('.html')]

for fname in sorted(files):
    fpath = os.path.join(workspace, fname)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    html_end_count = content.count('</html>')
    print(f"File: {fname}")
    print(f"  Total lines: {len(content.splitlines())}")
    print(f"  </html> occurrences: {html_end_count}")
    
    if html_end_count > 1:
        # Keep only up to the final root </html> (the last outer </html> before duplicates)
        # Find where duplication occurred
        pos = 0
        indices = []
        while True:
            idx = content.find('</html>', pos)
            if idx == -1: break
            indices.append(idx)
            pos = idx + 7
        print(f"  </html> indices: {indices}")
