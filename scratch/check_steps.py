import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('C:/Users/Prodaja/.gemini/antigravity-ide/brain/d0063de3-3bb9-42da-bcbd-9db3d1ba7f94/.system_generated/logs/transcript.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        print(f"Step {obj.get('step_index')}: Type: {obj.get('type')}, Source: {obj.get('source')}, Status: {obj.get('status')}")
