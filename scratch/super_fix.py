import os
import re

def super_fix(filepath):
    try:
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # Aggressive Mojibake Fix
        # Fix double/triple encoded UTF-8
        content = content.replace(b'\xc3\x83\xc2\x81', 'Á'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xa7', 'ç'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xa3', 'ã'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xaa', 'ê'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xa1', 'á'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xa9', 'é'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xad', 'í'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xb3', 'ó'.encode('utf-8'))
        content = content.replace(b'\xc3\x83\xc2\xba', 'ú'.encode('utf-8'))
        
        try:
            text = content.decode('utf-8')
        except UnicodeDecodeError:
            text = content.decode('latin-1')
        
        # Character replacements
        replacements = {
            'Ã rea': 'Área',
            'AçÃµes': 'Ações',
            'Ãµ': 'õ',
            'Ã§': 'ç',
            'Ã£': 'ã',
            'Ã¡': 'á',
            'Ã©': 'é',
            'Ã­': 'í',
            'Ã³': 'ó',
            'Ãº': 'ú',
            'Ãª': 'ê',
            'Ã ': 'à',
            'â€¢': '•',
            'Â©': '©',
            'â€”': '—',
            'ðŸ‘‘': '👑',
            'ðŸ”§': '🔧',
            'ðŸ‘¤': '👤',
            'â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢': '••••••••',
        }
        for moji, real in replacements.items():
            text = text.replace(moji, real)
        
        # Fix Spacing: Remove ALL empty lines first to "reset" the file
        text = text.replace('\r\n', '\n').replace('\r', '\n')
        # Remove empty lines (lines that contain only whitespace)
        lines = text.split('\n')
        cleaned_lines = [line for line in lines if line.strip()]
        
        # Re-add a few empty lines for readability (e.g., after imports)
        final_lines = []
        for i, line in enumerate(cleaned_lines):
            final_lines.append(line)
            # Add an empty line after imports block
            if line.startswith('import ') and i < len(cleaned_lines)-1 and not cleaned_lines[i+1].startswith('import '):
                final_lines.append('')
            # Add an empty line between functions/components
            elif line.startswith('export ') or line.startswith('function ') or line.startswith('const '):
                if i > 0 and not final_lines[-2] == '':
                    final_lines.insert(-1, '')
        
        text = '\n'.join(final_lines)
        
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            f.write(text)
        print(f"Super Fixed: {filepath}")
    except Exception as e:
        print(f"Error fixing {filepath}: {e}")

root_dir = 'src'
for root, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css')):
            super_fix(os.path.join(root, file))

super_fix('README.md')
super_fix('package.json')
super_fix('supabase-schema.sql')
