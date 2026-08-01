import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('C:/Users/Prodaja/.gemini/antigravity-ide/brain/d0063de3-3bb9-42da-bcbd-9db3d1ba7f94/.system_generated/logs/transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        if obj.get('type') == 'BROWSER_SUBAGENT':
            print(f"Step {obj.get('step_index')}: BROWSER_SUBAGENT")
            content = obj.get('content', '')
            # Print if there's any content
            if content:
                print(content[:2000])
