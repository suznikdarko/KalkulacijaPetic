import re

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the exportQuoteWord function at line 2016
old_func = '''        function exportQuoteWord() {
            try {
                const htmlContent = getQuoteHTML(true);
                const blob = new Blob(['\\ufeff', htmlContent], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const projectName = document.getElementById('calc-project-name').value || 'Ponudba';
                link.href = url;
                link.download = "Ponudba_" + projectName.replace(/\s+/g, '_') + ".doc";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error("Napaka pri shranjevanju v Word:", e);
                alert("Napaka pri shranjevanju: " + e.message);
            }
        }'''

new_func = '''        async function exportQuoteWord() {
            try {
                const htmlContent = getQuoteHTML(true);
                const projectName = document.getElementById('calc-project-name').value || 'Ponudba';
                const fileName = "Ponudba_" + projectName.replace(/\\s+/g, '_') + ".doc";
                
                try {
                    const srvRes = await fetch('http://127.0.0.1:8095', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: fileName, content: htmlContent, type: 'word' })
                    });
                    if (srvRes.ok) {
                        const srvData = await srvRes.json();
                        alert(srvData.message || 'Uspešno shranjeno na strežnik!');
                        return;
                    }
                } catch (err) {
                    console.log('Server save failed, falling back to local download', err);
                }

                const blob = new Blob(['\\ufeff', htmlContent], { type: 'application/msword' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error("Napaka pri shranjevanju v Word:", e);
                alert("Napaka pri shranjevanju: " + e.message);
            }
        }'''

if old_func in html:
    html = html.replace(old_func, new_func)
    print("Replaced main exportQuoteWord")
else:
    print("Could not find old_func")

# Replace exportQuoteWord inside preview window
preview_old = '''                        function exportQuoteWord(isAT) {
                            const content = document.querySelector('.editable-area').innerHTML;
                            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
                            const footer = "</body></html>";
                            const sourceHTML = header + content + footer;
                            const blob = new Blob(['\\ufeff', sourceHTML], { type: 'application/msword' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = isAT ? 'Angebot.doc' : 'Ponudba.doc';
                            link.click();
                            URL.revokeObjectURL(url);
                        }'''

preview_new = '''                        async function exportQuoteWord(isAT) {
                            const content = document.querySelector('.editable-area').innerHTML;
                            const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'></head><body>";
                            const footer = "</body></html>";
                            const sourceHTML = header + content + footer;
                            const fileName = isAT ? 'Angebot.doc' : 'Ponudba.doc';

                            try {
                                const srvRes = await fetch('http://127.0.0.1:8095', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ filename: fileName, content: sourceHTML, type: 'word' })
                                });
                                if (srvRes.ok) {
                                    const srvData = await srvRes.json();
                                    alert(srvData.message || 'Uspešno shranjeno na strežnik!');
                                    return;
                                }
                            } catch (err) {
                                console.log('Server save failed, falling back to local download', err);
                            }

                            const blob = new Blob(['\\ufeff', sourceHTML], { type: 'application/msword' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = fileName;
                            link.click();
                            URL.revokeObjectURL(url);
                        }'''

if preview_old in html:
    html = html.replace(preview_old, preview_new)
    print("Replaced preview exportQuoteWord")
else:
    print("Could not find preview_old")

with open(r'c:\DARKO\KalkulacijaPetric\kuverte1.html', 'w', encoding='utf-8') as f:
    f.write(html)

