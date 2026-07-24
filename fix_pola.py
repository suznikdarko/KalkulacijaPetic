import re

with open('pola.html', 'rb') as f:
    text = f.read().decode('utf-8')

style_rule = '''
        .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
'''

# The string that was injected:
injected = style_rule + '\n    </style>'

# We want to keep ONLY the first one.
# So first, replace ALL of them with '</style>'
text = text.replace(injected, '</style>')

# Then add it back only at the FIRST occurrence of '</style>'
text = text.replace('</style>', injected, 1)

with open('pola.html', 'wb') as f:
    f.write(text.encode('utf-8'))
print("Fixed pola.html syntax error!")
