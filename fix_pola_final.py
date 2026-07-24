with open('pola.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for i, line in enumerate(lines):
    if '</style ></head > <body>" + htmlContent + "</body></html > ";' in line:
        new_lines.append('                let fullHtml = "<!DOCTYPE html><html xmlns:o=\'urn:schemas-microsoft-com:office:office\' xmlns:w=\'urn:schemas-microsoft-com:office:word\' xmlns=\'http://www.w3.org/TR/REC-html40\'><head><meta charset=\'utf-8\'><title>" + name + "</title><style>body { font-family: Arial, sans-serif; margin: 0; padding: 10px; } table { width: 100%; border-collapse: collapse; } td, th { padding: 4px; }</style></head><body>" + htmlContent + "</body></html>";\n')
    else:
        new_lines.append(line)

with open('pola.html', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print('Fixed line 6449!')
