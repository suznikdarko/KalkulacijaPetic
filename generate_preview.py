import base64

def b64(fn):
    with open(fn, 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')

b64_v1 = b64('logo_v1_gray_orange_2x.png')
b64_v2 = b64('logo_v2_all_orange_2x.png')
b64_v3 = b64('logo_v3_gray_darkorange_2x.png')

html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Primerjava novih logotipov</title>
<style>
body {{ font-family: Arial, sans-serif; padding: 25px; background: #e2e8f0; }}
.card {{ background: white; padding: 25px; margin-bottom: 25px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); max-width: 850px; }}
h2 {{ margin-top: 0; color: #1e293b; font-size: 15pt; }}
p {{ color: #64748b; font-size: 10pt; margin-bottom: 15px; }}
</style>
</head>
<body>

<div class="card">
  <h2>1. STARO STANJE (navaden HTML tekst v tabeli):</h2>
  <p>Tako je bilo do sedaj:</p>
  <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">
      <tr>
          <td style="width: 32%; vertical-align: top;">
              <table cellpadding="0" cellspacing="0" style="border: none; margin: 0; padding: 0; font-family: Arial, sans-serif; border-collapse: collapse;"><tr><td style="color: #8c8f91; font-size: 20px; font-style: italic; font-weight: normal; margin: 0; padding: 0; line-height: 1.1; border: none;">tiskarna</td></tr><tr><td style="color: #f99c26; font-size: 36px; font-style: italic; font-weight: bold; margin: 0; padding: 0; padding-left: 15px; line-height: 1.1; border: none;">petrič</td></tr></table>
          </td>
          <td style="width: 25%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;"><strong>Tiskarna Petrič d.o.o.</strong><br>Tovarniška cesta 8<br>3210 Slovenske Konjice<br>ID za DDV: SI50694014</td>
          <td style="width: 20%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">T: 03 757 25 56<br>F: 03 757 25 63<br>Mat. št.: 6889433</td>
          <td style="width: 23%; vertical-align: bottom; border-left: 2px solid #f99c26; padding-left: 15px; padding-bottom: 5px; font-size: 18px; font-weight: bold; color: #f99c26; font-style: italic;">vse stiska</td>
      </tr>
  </table>
</div>

<div class="card">
  <h2>2. NOVO - Varianta A: 'tiskarna' siva (#8c8f91), 'petrič' oranžna (#f99c26):</h2>
  <p>Originalna tipografija iz naložene grafike, bela podlaga, z originalnimi barvami (tiskarna siva, petrič oranžna kot prej):</p>
  <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">
      <tr>
          <td style="width: 32%; vertical-align: middle;">
              <img src="data:image/png;base64,{b64_v3}" style="height: 58px; max-width: 100%; object-fit: contain; display: block;" alt="Tiskarna Petrič">
          </td>
          <td style="width: 25%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;"><strong>Tiskarna Petrič d.o.o.</strong><br>Tovarniška cesta 8<br>3210 Slovenske Konjice<br>ID za DDV: SI50694014</td>
          <td style="width: 20%; vertical-align: middle; border-left: 2px solid #f99c26; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">T: 03 757 25 56<br>F: 03 757 25 63<br>Mat. št.: 6889433</td>
          <td style="width: 23%; vertical-align: bottom; border-left: 2px solid #f99c26; padding-left: 15px; padding-bottom: 5px; font-size: 18px; font-weight: bold; color: #f99c26; font-style: italic;">vse stiska</td>
      </tr>
  </table>
</div>

<div class="card">
  <h2>3. NOVO - Varianta B: Celoten napis 'tiskarna petrič' v oranžni barvi (#fba631):</h2>
  <p>Originalna tipografija iz naložene grafike, bela podlaga, celoten napis v oranžni barvi:</p>
  <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #fba631; padding-bottom: 5px;" cellpadding="0" cellspacing="0">
      <tr>
          <td style="width: 32%; vertical-align: middle;">
              <img src="data:image/png;base64,{b64_v2}" style="height: 58px; max-width: 100%; object-fit: contain; display: block;" alt="Tiskarna Petrič">
          </td>
          <td style="width: 25%; vertical-align: middle; border-left: 2px solid #fba631; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;"><strong>Tiskarna Petrič d.o.o.</strong><br>Tovarniška cesta 8<br>3210 Slovenske Konjice<br>ID za DDV: SI50694014</td>
          <td style="width: 20%; vertical-align: middle; border-left: 2px solid #fba631; padding-left: 15px; font-size: 9px; color: #8c8f91; font-style: italic;">T: 03 757 25 56<br>F: 03 757 25 63<br>Mat. št.: 6889433</td>
          <td style="width: 23%; vertical-align: bottom; border-left: 2px solid #fba631; padding-left: 15px; padding-bottom: 5px; font-size: 18px; font-weight: bold; color: #fba631; font-style: italic;">vse stiska</td>
      </tr>
  </table>
</div>

</body>
</html>"""

with open('preview_logo.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Updated preview_logo.html successfully')
