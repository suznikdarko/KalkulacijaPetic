import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Popravi let d = calculateForSingleQty(...) -> let calcRes = calculateForSingleQty(...) in preberi details
    content = re.sub(
        r"let d = calculateForSingleQty\((.*?)\);\s*if \(!d\) return \"Napaka pri generiranju naloga\.\";",
        r"let calcRes = calculateForSingleQty(\1);\n            if (!calcRes) return \"Napaka pri generiranju naloga.\";\n            let d = calcRes.details;",
        content
    )
    
    # 2. Popravi let qty = d.qty || q || 0; -> let qty = calcRes.qty || q || 0;
    content = re.sub(
        r"let qty = d\.qty \|\| q \|\| 0;",
        r"let qty = calcRes.qty || q || 0;",
        content
    )

    # 3. Popravi let sourceSheets = d.paper.totalSourceSheets || 0; -> let sourceSheets = d.paper.sourceSheets || 0;
    content = re.sub(
        r"let sourceSheets = d\.paper\.totalSourceSheets \|\| 0;",
        r"let sourceSheets = d.paper.sourceSheets || 0;",
        content
    )

    # 4. Popravi finishList in izračun dodelave
    finishList_orig = """            let finishList = [];
            if (d.finish.cilinder) finishList.push("Cilinder");
            if (d.finish.zgibanje) finishList.push("Zgibanje");
            if (d.finish.lepljenje) finishList.push("Lepljenje");
            if (d.finish.plastikaType !== 'Brez') finishList.push("Plastifikacija: " + d.finish.plastikaType);
            if (d.finish.uv) finishList.push("UV Lak");
            if (d.finish.zlatotisk) finishList.push("Zlatotisk");
            if (d.finish.izsekovanje) finishList.push("Izsekovanje");
            if (d.finish.blister) finishList.push("Blister");
            if (d.finish.spiral) finishList.push("Špiraljenje");"""
    
    finishList_new = """            let formatW = document.getElementById('width').value || 0;
            let formatH = document.getElementById('height').value || 0;
            let finishList = getActiveFinishingList();
            let physicalWasteSheets = totalSheets - calcRes.sheetsNeeded;"""
    
    content = content.replace(finishList_orig, finishList_new)

    # 5. Popravi formata v tabelah: ${d.project.w} x ${d.project.h} -> ${formatW} x ${formatH}
    content = content.replace(
        r"${d.project.w} x ${d.project.h}",
        r"${formatW} x ${formatH}"
    )

    # 6. Popravi izris tiska: ${d.paper.sheetsNeeded...} + ${d.paper.physicalWasteSheets...} -> calcRes in physicalWasteSheets
    content = content.replace(
        r"${d.paper.sheetsNeeded.toLocaleString('sl-SI')} + ${d.paper.physicalWasteSheets.toLocaleString('sl-SI')}",
        r"${calcRes.sheetsNeeded.toLocaleString('sl-SI')} + ${physicalWasteSheets.toLocaleString('sl-SI')}"
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
fix_file(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\tiskovna-pola-kalkulator.html")
fix_file(r"C:\DARKO\KalkulacijaPetric\TISKOVNA POLA\ročna tiskovna pola.html")
print("Done")
