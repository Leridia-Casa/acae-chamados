import os
import re

def fix_file(filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # Try to decode as utf-8 first
        try:
            text = content.decode('utf-8')
        except UnicodeDecodeError:
            # If it fails, it might be the corrupted encoding (latin-1 or something)
            text = content.decode('latin-1')
        
        # Comprehensive Portuguese Mojibake Fix
        replacements = {
            'Ã£': 'ã',
            'Ã§': 'ç',
            'Ã¡': 'á',
            'Ã©': 'é',
            'Ã­': 'í',
            'Ã³': 'ó',
            'Ãº': 'ú',
            'Ãª': 'ê',
            'Ã ': 'à',
            'Â©': '©',
            'â€”': '—',
            'Ã¢': 'â',
            'Ã´': 'ô',
        }
        for moji, real in replacements.items():
            text = text.replace(moji, real)
        
        # Ensure Acaê branding is consistently applied
        text = re.sub(r'Aca[eêÃ][^ \-\)\(\"\'\{\}]+', 'Acaê', text)
        text = text.replace('Acae', 'Acaê')
        text = text.replace('--Acaê-', '--Acaê-') # Double check
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Fixed {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

root_dir = 'src'
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.html')):
            fix_file(os.path.join(root, file))

fix_file('README.md')
fix_file('package.json')
fix_file('supabase-schema.sql')
