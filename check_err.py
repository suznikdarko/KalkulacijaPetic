with open('k_script_0.js', 'r', encoding='utf-8') as f:
    text = f.read()

import re
text_stripped = re.sub(r'//.*', '', text)
text_stripped = re.sub(r'/\*.*?\*/', '', text_stripped, flags=re.DOTALL)
text_stripped = re.sub(r'\"(?:\\\\.|[^\"])*\"', '\"\"', text_stripped)
text_stripped = re.sub(r"\'(?:\\\\.|[^\'])*\'", "''", text_stripped)
text_stripped = re.sub(r'\`(?:\\\\.|[^\`])*\`', '\`\`', text_stripped)

print(text_stripped[32850:33000])
