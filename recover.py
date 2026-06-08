import os

def recover_file(filepath):
    try:
        with open(filepath, 'rb') as f:
            b = f.read()
            
        # Only recover if it has the tell-tale double UTF-16 corruption
        if b'<\x00!\x00D\x00O\x00' not in b:
            print(f"File {filepath} doesn't look corrupted in the expected way.")
            return

        # Strip null bytes
        b = b.replace(b'\x00', b'')
        
        # Replace broken characters
        b = b.replace(b'\r\r\n\x01', b'\xc4\x8d') # č
        b = b.replace(b'\r\n\x01', b'\xc4\x8d')   # č (fallback)
        b = b.replace(b'\n\x01', b'\xc4\x8d')     # č (fallback)
        b = b.replace(b'\x0d\x01', b'\xc4\x8d')   # č (raw)
        
        b = b.replace(b'a\x01', b'\xc5\xa1')      # š
        b = b.replace(b'~\x01', b'\xc5\xbe')      # ž
        b = b.replace(b'\x0c\x01', b'\xc4\x8c')   # Č
        b = b.replace(b'`\x01', b'\xc5\xa0')      # Š
        b = b.replace(b'}\x01', b'\xc5\xbd')      # Ž
        
        b = b.replace(b'\x07\x01', b'\xc4\x87')   # ć
        b = b.replace(b'\x11\x01', b'\xc4\x91')   # đ
        b = b.replace(b'\x06\x01', b'\xc4\x86')   # Ć
        b = b.replace(b'\x10\x01', b'\xc4\x90')   # Đ

        # Clean up BOM and replacement chars
        b = b.replace(b'\xef\xbf\xbd', b'')
        if b.startswith(b'\xef\xbb\xbf'):
            b = b[3:]
            
        # Fix double newlines
        b = b.replace(b'\r\r\n', b'\r\n')
        
        with open(filepath, 'wb') as f:
            f.write(b)
        print(f"Recovered {filepath}")
        
    except Exception as e:
        print(f"Error on {filepath}: {e}")

recover_file(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
