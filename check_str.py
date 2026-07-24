import re
with open('pola.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The original was something like:
# var htmlContent = "<html><head><style>... </style></head><body>"
# We injected a newline before </style> because of:
# style_rule + '\n    </style>'

# Let's see if we can find newlines right before </style> inside strings
for m in re.finditer(r'[\r\n]+\s*</style>', text):
    start = max(0, m.start() - 20)
    end = min(len(text), m.end() + 20)
    print("MATCH:\n", text[start:end])
