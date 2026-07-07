import os
import re

# Match the old 4/0 array for S8 and replace it
# Since it might have \n or actual newlines, we'll use a very relaxed regex
pattern = re.compile(
    r'"4/0":\s*\[\s*\{\s*q:\s*1000,\s*waste:\s*320,\s*s150:\s*3100,\s*s250:\s*3000,\s*s350:\s*2900\s*\},\s*'
    r'\{\s*q:\s*5000,\s*waste:\s*320,\s*s150:\s*5070,\s*s250:\s*4750,\s*s350:\s*4250\s*\},\s*'
    r'\{\s*q:\s*10000,\s*waste:\s*320,\s*s150:\s*6400,\s*s250:\s*6000,\s*s350:\s*5400\s*\},\s*'
    r'\{\s*q:\s*50000,\s*waste:\s*320,\s*s150:\s*6800,\s*s250:\s*6300,\s*s350:\s*5700\s*\},\s*'
    r'\{\s*q:\s*100000,\s*waste:\s*320,\s*s150:\s*6800,\s*s250:\s*6300,\s*s350:\s*5700\s*\},\s*'
    r'\{\s*q:\s*300000,\s*waste:\s*320,\s*s150:\s*7140,\s*s250:\s*6600,\s*s350:\s*6060\s*\},\s*'
    r'\{\s*q:\s*500000,\s*waste:\s*625,\s*s150:\s*7140,\s*s250:\s*6600,\s*s350:\s*6060\s*\}\s*\]'
)

new_block = '''"4/0": [
                        { q: 1000, waste: 320, s150: 3600, s250: 3200, s350: 3000 },
                        { q: 5000, waste: 320, s150: 5070, s250: 5600, s350: 5150 },
                        { q: 10000, waste: 320, s150: 6400, s250: 6000, s350: 5450 },
                        { q: 50000, waste: 320, s150: 6800, s250: 6300, s350: 5700 },
                        { q: 100000, waste: 320, s150: 6800, s250: 6600, s350: 6060 },
                        { q: 300000, waste: 320, s150: 7140, s250: 6600, s350: 6060 },
                        { q: 500000, waste: 625, s150: 7140, s250: 6600, s350: 6060 }
                    ]'''

for f in ['etikete.html', 'kuverte.html', 'brosura.html']:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We only want to replace the second match (which is the else block for S8)
    # or just replace all matches if both are the same, but wait! The S4 block is different.
    # The pattern explicitly matches the OLD S8 values (e.g. s150: 3100), which differ from S4 (s150: 3100, wait, S4 has 5000 waste:320 s150:6600!)
    # Yes, S4 has 6600 at q=5000! So this pattern uniquely matches S8!
    
    if pattern.search(content):
        new_content = pattern.sub(new_block, content)
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f'Updated {f}')
    else:
        print(f'Pattern not found in {f}')
