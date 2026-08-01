import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
with open('C:/Users/Prodaja/.gemini/antigravity-ide/brain/d0063de3-3bb9-42da-bcbd-9db3d1ba7f94/.system_generated/logs/transcript_full.jsonl', 'r', encoding='utf-8') as f:
    for line in f:
        obj = json.loads(line)
        idx = obj.get('step_index')
        if idx is not None and 205 <= idx <= 215:
            print(f"--- Step {idx} ({obj.get('type')}, {obj.get('source')}) ---")
            print(str(obj.get('content', ''))[:1000])
            if 'error' in obj:
                print(f"Error: {obj.get('error')}")
