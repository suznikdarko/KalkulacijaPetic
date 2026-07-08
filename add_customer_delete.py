import os
import glob
import re

html_files = glob.glob(r'c:\DARKO\KalkulacijaPetric\*.html')

pattern = re.compile(r"""([ \t]+)var item = document\.createElement\('div'\);\s+item\.style\.padding = "8px 12px";\s+item\.style\.cursor = "pointer";\s+item\.style\.borderBottom = "1px solid #334155";\s+item\.style\.fontSize = "0\.9rem";\s+item\.innerText = customers\[j\];\s+item\.onclick = \(function \(name\) \{\s+return function \(\) \{\s+document\.getElementById\('calc-customer'\)\.value = name;\s+document\.getElementById\('cust-dropdown-list'\)\.style\.display = 'none';\s+handleCustomerUpdate\(name\);\s+\};\s+\}\)\(customers\[j\]\);""")

for filepath in html_files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if pattern.search(content):
        # We replace the matched string with our new DOM logic
        def replacer(match):
            indent = match.group(1)
            new_code = f"""{indent}var item = document.createElement('div');
{indent}item.style.padding = "8px 12px";
{indent}item.style.cursor = "pointer";
{indent}item.style.borderBottom = "1px solid #334155";
{indent}item.style.fontSize = "0.9rem";
{indent}item.style.display = "flex";
{indent}item.style.justifyContent = "space-between";
{indent}item.style.alignItems = "center";

{indent}var nameSpan = document.createElement('span');
{indent}nameSpan.innerText = customers[j];
{indent}item.appendChild(nameSpan);

{indent}var delBtn = document.createElement('span');
{indent}delBtn.innerHTML = '&#10006;'; // X icon
{indent}delBtn.style.color = '#ef4444';
{indent}delBtn.style.fontSize = '0.8rem';
{indent}delBtn.style.padding = '2px 8px';
{indent}delBtn.style.borderRadius = '4px';
{indent}delBtn.title = 'Odstrani stranko iz predpomnilnika';
{indent}delBtn.onclick = (function(name) {{
{indent}    return function(e) {{
{indent}        e.stopPropagation();
{indent}        if(confirm('Ali res želite odstraniti stranko "' + name + '" iz arhiva? (Če je stranka shranjena v katerem od vaših projektov, se bo morda znova pojavila)')) {{
{indent}            var cache = JSON.parse(localStorage.getItem('petric_customers_cache') || '[]');
{indent}            var idx = cache.indexOf(name);
{indent}            if(idx > -1) {{
{indent}                cache.splice(idx, 1);
{indent}                localStorage.setItem('petric_customers_cache', JSON.stringify(cache));
{indent}            }}
{indent}            updateCustomerDatalist();
{indent}            // Also re-render the dropdown list itself
{indent}            renderCustomerList();
{indent}        }}
{indent}    }};
{indent}}})(customers[j]);
{indent}delBtn.onmouseover = function() {{ this.style.background = '#fecaca'; }};
{indent}delBtn.onmouseout = function() {{ this.style.background = 'transparent'; }};
{indent}item.appendChild(delBtn);

{indent}item.onclick = (function (name) {{
{indent}    return function () {{
{indent}        document.getElementById('calc-customer').value = name;
{indent}        document.getElementById('cust-dropdown-list').style.display = 'none';
{indent}        handleCustomerUpdate(name);
{indent}    }};
{indent}}})(customers[j]);"""
            return new_code
            
        content = pattern.sub(replacer, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Logic not found in {filepath}")
