
const fs = require("fs");

const newTableCode = `
        function getBossTables() {
            return {
                "4/0": [
                    {q: 1000, waste: 320, s150: 2600, s250: 2500, s350: 2400},
                    {q: 5000, waste: 320, s150: 5070, s250: 4750, s350: 4250},
                    {q: 10000, waste: 320, s150: 6400, s250: 6000, s350: 5400},
                    {q: 50000, waste: 320, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 320, s150: 6800, s250: 6300, s350: 5700},
                    {q: 300000, waste: 320, s150: 7140, s250: 6600, s350: 6060},
                    {q: 500000, waste: 625, s150: 7140, s250: 6600, s350: 6060}
                ],
                "4/4": [
                    {q: 1000, waste: 1280, s150: 2600, s250: 3200, s350: 3000},
                    {q: 5000, waste: 1280, s150: 5070, s250: 5600, s350: 5150},
                    {q: 10000, waste: 1280, s150: 6400, s250: 6000, s350: 5450},
                    {q: 50000, waste: 1280, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 1280, s150: 6800, s250: 6600, s350: 6050},
                    {q: 300000, waste: 1500, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 2500, s150: 7140, s250: 6600, s350: 6050}
                ],
                "4/OB": [
                    {q: 1000, waste: 540, s150: 3580, s250: 3300, s350: 3250},
                    {q: 5000, waste: 540, s150: 4400, s250: 4400, s350: 4400},
                    {q: 10000, waste: 540, s150: 5050, s250: 6000, s350: 5450},
                    {q: 50000, waste: 540, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 540, s150: 6800, s250: 6600, s350: 6060},
                    {q: 300000, waste: 750, s150: 7140, s250: 6600, s350: 6060},
                    {q: 500000, waste: 1250, s150: 7140, s250: 6600, s350: 6060}
                ],
                "4/OB + mutacija 1x": [
                    {q: 1000, waste: 940, s150: 4000, s250: 3800, s350: 3600},
                    {q: 5000, waste: 940, s150: 5500, s250: 5100, s350: 4700},
                    {q: 10000, waste: 940, s150: 6450, s250: 6000, s350: 5450},
                    {q: 50000, waste: 940, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 940, s150: 6800, s250: 6600, s350: 6050},
                    {q: 300000, waste: 1150, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 1650, s150: 7140, s250: 6600, s350: 6050}
                ],
                "4/OB + mutacija 2x": [
                    {q: 1000, waste: 1340, s150: 4100, s250: 3800, s350: 3600},
                    {q: 5000, waste: 1340, s150: 4800, s250: 5100, s350: 4700},
                    {q: 10000, waste: 1340, s150: 6200, s250: 6000, s350: 5450},
                    {q: 50000, waste: 1340, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 1340, s150: 6800, s250: 6600, s350: 6050},
                    {q: 300000, waste: 1550, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 2050, s150: 7140, s250: 6600, s350: 6050}
                ],
                "4/OB + mutacija 3x": [
                    {q: 1000, waste: 1740, s150: 4100, s250: 3800, s350: 3600},
                    {q: 5000, waste: 1740, s150: 4800, s250: 5100, s350: 4700},
                    {q: 10000, waste: 1740, s150: 6200, s250: 6000, s350: 5450},
                    {q: 50000, waste: 1740, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 1740, s150: 6800, s250: 6600, s350: 6050},
                    {q: 300000, waste: 1950, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 2450, s150: 7140, s250: 6600, s350: 6050}
                ],
                "4/4 + mutacija 1x": [
                    {q: 1000, waste: 3680, s150: 6400, s250: 5900, s350: 5450},
                    {q: 5000, waste: 3680, s150: 6400, s250: 6000, s350: 5490},
                    {q: 10000, waste: 3680, s150: 6200, s250: 6000, s350: 5490},
                    {q: 50000, waste: 3680, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 3680, s150: 6800, s250: 6600, s350: 6050},
                    {q: 300000, waste: 3900, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 4900, s150: 7140, s250: 6600, s350: 6050}
                ],
                "4/4 + mutacija 2x": [
                    {q: 1000, waste: 6080, s150: 6400, s250: 6000, s350: 5450},
                    {q: 5000, waste: 6080, s150: 6400, s250: 6000, s350: 5450},
                    {q: 10000, waste: 6080, s150: 6800, s250: 6300, s350: 5700},
                    {q: 50000, waste: 6080, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 6080, s150: 7140, s250: 6600, s350: 6050},
                    {q: 300000, waste: 6300, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 7300, s150: 7140, s250: 6600, s350: 6050}
                ],
                "4/4 + mutacija 3x": [
                    {q: 1000, waste: 8480, s150: 6400, s250: 6000, s350: 5450},
                    {q: 5000, waste: 8480, s150: 6800, s250: 6000, s350: 5450},
                    {q: 10000, waste: 8480, s150: 6200, s250: 6300, s350: 5700},
                    {q: 50000, waste: 8480, s150: 6800, s250: 6300, s350: 5700},
                    {q: 100000, waste: 8480, s150: 6800, s250: 6600, s350: 6050},
                    {q: 300000, waste: 8700, s150: 7140, s250: 6600, s350: 6050},
                    {q: 500000, waste: 9700, s150: 7140, s250: 6600, s350: 6050}
                ]
            };
        }

        function calculateForSingleQty`;

const dynamicSpeedLogic = `
                let bossTable = getBossTables()[speedTableMode] || getBossTables()[baseColorMode];
                if (bossTable) {
                    let getS = (obj) => {
                        if (grammage <= 150) return obj.s150;
                        if (grammage <= 250) {
                            let f = (grammage - 150) / 100;
                            return obj.s150 + f * (obj.s250 - obj.s150);
                        }
                        if (grammage <= 350) {
                            let f = (grammage - 250) / 100;
                            return obj.s250 + f * (obj.s350 - obj.s250);
                        }
                        return obj.s350;
                    };

                    let s = getS(bossTable[0]);
                    if (qty <= bossTable[0].q) {
                        s = getS(bossTable[0]);
                    } else if (qty >= bossTable[bossTable.length - 1].q) {
                        s = getS(bossTable[bossTable.length - 1]);
                    } else {
                        for (let i = 0; i < bossTable.length - 1; i++) {
                            if (qty >= bossTable[i].q && qty <= bossTable[i + 1].q) {
                                let rangeQ = bossTable[i + 1].q - bossTable[i].q;
                                let speed1 = getS(bossTable[i]);
                                let speed2 = getS(bossTable[i + 1]);
                                let rangeS = speed2 - speed1;
                                let fraction = (qty - bossTable[i].q) / rangeQ;
                                s = speed1 + fraction * rangeS;
                                break;
                            }
                        }
                    }
                    return Math.round(s);
                }
`;

function processFile(path) {
    let content = fs.readFileSync(path, "utf-8");
    
    // Inject getBossTables
    if (!content.includes("function getBossTables()")) {
        content = content.replace("        function calculateForSingleQty", newTableCode);
    }
    
    // Replace let newBossTables in waste calculation
    let regexWaste = /let newBossTables = \{[\s\S]*?mutacija 3x.*?\n\s*\};\s*let bossTable = newBossTables\[tableMode\] \|\| newBossTables\[_colorMode\];/g;
    content = content.replace(regexWaste, "let bossTable = getBossTables()[tableMode] || getBossTables()[_colorMode];");

    // Replace let newBossTables in speed calculation
    let regexSpeed = /let newBossTables = \{[\s\S]*?mutacija 3x.*?\n\s*\};\s*let bossTable = newBossTables\[speedTableMode\] \|\| newBossTables\[baseColorMode\];\s*if \(bossTable\) \{[\s\S]*?return Math\.round\(s\);\s*\}/g;
    content = content.replace(regexSpeed, dynamicSpeedLogic.trim());

    fs.writeFileSync(path, content);
}

processFile("C:\\\\DARKO\\\\KalkulacijaPetric\\\\TISKOVNA POLA\\\\tiskovna-pola-kalkulator.html");
processFile("C:\\\\DARKO\\\\KalkulacijaPetric\\\\TISKOVNA POLA\\\\ro\u010Dna tiskovna pola.html");
console.log("Done");

