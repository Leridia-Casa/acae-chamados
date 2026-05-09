import os
import re

def clean_spacing(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        # Replace 3 or more newlines with 2 newlines (one empty line)
        cleaned = re.sub(r'\n{3,}', '\n\n', text)
        
        # Also handle potential \r\n issues
        cleaned = cleaned.replace('\r\n', '\n')
        cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)
        
        # Final cleanup: ensure single newline at end
        cleaned = cleaned.strip() + '\n'
        
        if cleaned != text:
            with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                f.write(cleaned)
            print(f"Cleaned spacing in {filepath}")
    except Exception as e:
        print(f"Error cleaning {filepath}: {e}")

root_dir = 'src'
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            clean_spacing(os.path.join(root, file))
