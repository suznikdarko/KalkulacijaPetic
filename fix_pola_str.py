import re
with open('pola.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The specific matches are:
# th { padding: 4px; }\n</style></head><body>" + con
# We need to replace the newline with nothing.

text = text.replace('th { padding: 4px; }\n</style></head>', 'th { padding: 4px; }</style></head>')

with open('pola.html', 'w', encoding='utf-8') as f:
    f.write(text)
print("Fixed newlines before </style>")
