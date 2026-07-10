import re

with open(r"c:\DARKO\KalkulacijaPetric\brosura.html", "r", encoding="utf-8") as f:
    content = f.read()

globals_addition = """
            let quoteBasket = JSON.parse(localStorage.getItem('petric_quote_basket')) || [];
            let g_editedQuoteHTML = "";
            let g_editedQuoteATHTML = "";
            let g_editedWorkOrderHTML = "";
"""
content = re.sub(r"let quoteBasket = JSON\.parse\(localStorage\.getItem\('petric_quote_basket'\)\) \|\| \[\];", globals_addition, content)

save_addition = """
                        preparedBy: gv('calc-prepared-by'),
                        materialCode: gv('calc-material-code'),
                        editedQuoteHTML: g_editedQuoteHTML,
                        editedQuoteATHTML: g_editedQuoteATHTML,
                        editedWorkOrderHTML: g_editedWorkOrderHTML,
"""
content = re.sub(
    r"preparedBy:\s*gv\('calc-prepared-by'\),\s*materialCode:\s*gv\('calc-material-code'\),",
    save_addition,
    content
)

load_addition = """
                setV('calc-prepared-by', proj.preparedBy);
                setV('calc-material-code', proj.materialCode);
                g_editedQuoteHTML = proj.editedQuoteHTML || '';
                g_editedQuoteATHTML = proj.editedQuoteATHTML || '';
                g_editedWorkOrderHTML = proj.editedWorkOrderHTML || '';
"""
content = re.sub(
    r"setV\('calc-prepared-by',\s*proj\.preparedBy\);\s*setV\('calc-material-code',\s*proj\.materialCode\);",
    load_addition,
    content
)


content = content.replace("""                        ${!isWord ? `
                        <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%;">
                            <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI</button>
                            <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                            <button id="btn-move-text" onclick="if(typeof toggleMoveMode === 'function') toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PREMAKNI</button>
                        </div>
                        ` : ''}""", "")

old_body = """                        <div class="editable-area" ${!isWord ? 'contenteditable="true"' : ''} style="padding: ${isWord ? '10px' : '30px'};">
                        <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">"""

new_body = """
            const defaultContent = `
                        <table style="width: 100%; margin-bottom: 15px; border-bottom: 2px solid #f99c26; padding-bottom: 5px;" cellpadding="0" cellspacing="0">"""

content = content.replace(old_body, new_body)

old_end = """                        <div style="margin-top: 10px; font-size: 10px; font-style: italic;">${isAT ? 'Dieses Angebot hat für Sie erstellt:' : 'Ponudbo pripravil:'} ${preparedBy}</div>
                        </div>
                        ${!isWord ? `"""

new_end = """                        <div style="margin-top: 10px; font-size: 10px; font-style: italic;">${isAT ? 'Dieses Angebot hat für Sie erstellt:' : 'Ponudbo pripravil:'} ${preparedBy}</div>
            `;
            
            let contentToRender = defaultContent;
            if (!printBasket) {
                if (isDN && typeof g_editedWorkOrderHTML !== 'undefined' && g_editedWorkOrderHTML) {
                    contentToRender = g_editedWorkOrderHTML;
                } else if (!isDN && isAT && typeof g_editedQuoteATHTML !== 'undefined' && g_editedQuoteATHTML) {
                    contentToRender = g_editedQuoteATHTML;
                } else if (!isDN && !isAT && typeof g_editedQuoteHTML !== 'undefined' && g_editedQuoteHTML) {
                    contentToRender = g_editedQuoteHTML;
                }
            }
            const editedHTMLVar = isDN ? 'g_editedWorkOrderHTML' : (isAT ? 'g_editedQuoteATHTML' : 'g_editedQuoteHTML');
            
            return `
                ${htmlHeader}
                <head><meta charset="utf-8"><title>${isDN ? 'Delovni nalog' : 'Ponudba'}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 0; margin: 0; color: #000; line-height: 1.1; font-size: 11px; }
                    .info-table { border-collapse: collapse; margin-left: auto; margin-right: 0; }
                    .info-table td { padding: 1px 0 1px 15px; text-align: right; }
                    .info-table td:first-child { font-weight: normal; color: #555; }
                    .info-table td:last-child { font-weight: bold; }
                    h1 { font-size: 14px; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; }
                    .notes { margin-top: 10px; text-align: justify; font-size: 9px; line-height: 1.1; color: #444; }
                    @media print { .no-print { display: none !important; } }
                    .editable-area:focus { outline: 2px dashed #f99c26; background-color: #fffbeb; }
                    .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                    .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                </style>
                </head>
                <body>
                    ${!isWord ? `
                    <div class="no-print" contenteditable="false" style="background: #f1f5f9; padding: 10px; border-bottom: 1px solid #cbd5e1; display: flex; gap: 10px; align-items: center; justify-content: start; font-family: sans-serif; box-sizing: border-box; width: 100%; flex-wrap: wrap;">
                        <button onclick="window.print()" style="background: #10b981; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">NATISNI</button>
                        <button onclick="window.close()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">ZAPRI</button>
                        <button onclick="if(confirm('Ali želite ponastaviti besedilo na privzete vrednosti? (Spremembe bodo izgubljene)')){ if(window.opener){ ${isDN ? 'window.opener.g_editedWorkOrderHTML=\\'\\';' : (isAT ? 'window.opener.g_editedQuoteATHTML=\\'\\';' : 'window.opener.g_editedQuoteHTML=\\'\\';')} const newHtml = ${isDN ? 'window.opener.getQuoteHTML(false, null, false, false, true, ' + printBasket + ');' : (isAT ? 'window.opener.getQuoteHTML(false, null, false, true, false, ' + printBasket + ');' : 'window.opener.getQuoteHTML(false, null, false, false, false, ' + printBasket + ');')} document.open(); document.write(newHtml); document.close(); } }" style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PONASTAVI</button>
                        <button id="btn-move-text" onclick="if(typeof toggleMoveMode === 'function') toggleMoveMode(this)" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px;">PREMAKNI</button>
                        <div style="display: flex; gap: 4px; align-items: center; background: #cbd5e1; padding: 3px; border-radius: 6px;">
                            <button onclick="document.execCommand('bold', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-weight: bold; cursor: pointer; color: #000; font-size: 14px;" title="Krepko (Bold)">B</button>
                            <button onclick="document.execCommand('italic', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; font-style: italic; cursor: pointer; color: #000; font-size: 14px; font-family: Georgia, serif;" title="Ležeče (Italic)">I</button>
                            <button onclick="document.execCommand('underline', false, null)" style="background: white; border: none; border-radius: 4px; width: 28px; height: 28px; text-decoration: underline; cursor: pointer; color: #000; font-size: 14px;" title="Podčrtano (Underline)">U</button>
                            <select onchange="const sel = window.getSelection(); if (sel.rangeCount) { const range = sel.getRangeAt(0); if (range.toString().length > 0) { const span = document.createElement('span'); span.style.fontSize = this.value; span.appendChild(range.extractContents()); range.insertNode(span); } }; this.value='';" style="background: white; border: none; border-radius: 4px; height: 28px; padding: 0 5px; font-size: 12px; cursor: pointer; color: #000; width: 90px;" title="Velikost pisave">
                                <option value="" disabled selected>Velikost</option>
                                <option value="9px">9 px</option>
                                <option value="10px">10 px</option>
                                <option value="11px">11 px</option>
                                <option value="12px">12 px</option>
                                <option value="14px">14 px</option>
                                <option value="16px">16 px</option>
                                <option value="18px">18 px</option>
                                <option value="20px">20 px</option>
                            </select>
                        </div>
                    </div>
                    ` : ''}
                    <div class="editable-area" ${!isWord ? 'contenteditable="true"' : ''} style="padding: ${isWord ? '10px' : '30px'};">
                        ${contentToRender}
                    </div>
                    ${!isWord ? `"""

content = content.replace(old_end, new_end)


old_script = """                                        }
                                    }
                                });
                            }
                        <\/script>"""

new_script = """                                        }
                                    }
                                });
                                
                                const sync = () => {
                                    if (window.opener && !window.opener.closed) {
                                        if (!${printBasket}) {
                                            window.opener.${editedHTMLVar} = area.innerHTML;
                                        }
                                    }
                                };
                                
                                area.addEventListener('input', sync);
                                area.addEventListener('blur', sync);
                                area.addEventListener('keyup', sync);
                                
                                // Auto-select text formatting when clicking
                                area.addEventListener('mouseup', function(e) {
                                    let container = null;
                                    if (window.getSelection && window.getSelection().rangeCount > 0) {
                                        container = window.getSelection().getRangeAt(0).commonAncestorContainer;
                                    }
                                    if (container) {
                                        let editable = null;
                                        if (container.nodeType === 1) {
                                            editable = container.closest('[contenteditable="true"]');
                                        } else if (container.parentNode) {
                                            editable = container.parentNode.closest('[contenteditable="true"]');
                                        }
                                    }
                                });
                            }
                        <\/script>"""

content = content.replace(old_script, new_script)


old_return_top = """                return `
                    ${htmlHeader}
                    <head><meta charset="utf-8"><title>Ponudba</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 0; margin: 0; color: #000; line-height: 1.1; font-size: 11px; }
                        .info-table { border-collapse: collapse; margin-left: auto; margin-right: 0; }
                        .info-table td { padding: 1px 0 1px 15px; text-align: right; }
                        .info-table td:first-child { font-weight: normal; color: #555; }
                        .info-table td:last-child { font-weight: bold; }
                        h1 { font-size: 14px; font-weight: bold; margin-top: 10px; margin-bottom: 5px; letter-spacing: 1px; border-bottom: 1px solid #000; padding-bottom: 3px; }
                        .notes { margin-top: 10px; text-align: justify; font-size: 9px; line-height: 1.1; color: #444; }
                        @media print { .no-print { display: none !important; } }
                        .editable-area:focus { outline: 2px dashed #f99c26; background-color: #fffbeb; }
                        .editable-area p, .editable-area div:not(.header-top) { margin: 0; padding: 0; }
                        .editable-area.waiting-for-paste { cursor: cell !important; outline: 3px dashed #eab308 !important; background-color: #fffbeb !important; }
                    </style>
                    </head>
                    <body>"""

content = content.replace(old_return_top, "")

with open(r"c:\DARKO\KalkulacijaPetric\brosura.html", "w", encoding="utf-8") as f:
    f.write(content)
