import re
with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

start = html.find('function getQuoteHTML')
end = html.find('return <html><body></body></html>;', start)
print(html[start:end+100])
