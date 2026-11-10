/**
 * SEED PODATKI STRANK IN E-MAILOV - Tiskarna Petrič
 * Po navodilu uporabnika: šifra stranke naj bo prazna
 */
try {
    var _cache = JSON.parse(localStorage.getItem('petric_customer_contacts_cache') || '{}');
    var _changed = false;
    for (var _k in _cache) {
        if (_cache[_k] && _cache[_k].code) {
            delete _cache[_k].code;
            _changed = true;
        }
    }
    if (_changed) localStorage.setItem('petric_customer_contacts_cache', JSON.stringify(_cache));
} catch(e) {}

window.PETRIC_CONTACTS_SEED = {
  "belupo": {
    "name": "BELUPO",
    "email": "gasper.senica@belupo.si",
    "emails": [
      "gasper.senica@belupo.si"
    ],
    "address": "Dvorakova ulica 6\n1000 Ljubljana",
    "addresses": [
      "Dvorakova ulica 6\n1000 Ljubjana",
      "Dvorakova ulica 6\n1000 Ljubljana"
    ],
    "code": ""
  },
  "tenovis": {
    "name": "TENOVIS",
    "email": "info@tenovislabels.com",
    "emails": [
      "office@tenovislabels.com",
      "info@tenovislabels.com"
    ],
    "address": "Špelina ul. 1\n2000 Maribor",
    "addresses": [
      "Špelina ulica 1 \n2000 Maribor",
      "Špelina ulica 1\n2000 Maribor",
      "Špelina 1\n2000 Maribor",
      "Špelina ul. 1\n2000 Maribor"
    ],
    "code": ""
  },
  "embalaža kunej - marinka lesjak": {
    "name": "Embalaža Kunej - Marinka Lesjak",
    "email": "",
    "emails": [],
    "address": "Podsreda 51\n3257 Podsreda",
    "addresses": [
      "Podsreda 51\n3257 Podsreda"
    ],
    "code": ""
  },
  "otp banka": {
    "name": "OTP Banka",
    "email": "eva.gnidovec@otpbanka.si",
    "emails": [
      "anita.sobocan@otpbanka.si",
      "tilen.terbuc@otpbanka.si",
      "simon.popic@otpbanka.si",
      "klavdija.kac@otpbanka.si",
      "gordana.dragic@otpbanka.si",
      "kim.pintaric@otpbanka.si",
      "eva.gnidovec@otpbanka.si"
    ],
    "address": "Slovenska cesta 58\n1000  Ljubljana",
    "addresses": [
      "Slovenska cesta 58\n1000  Ljubljana"
    ],
    "code": ""
  },
  "otp": {
    "name": "OTP",
    "email": "klavdija.kac@otpbanka.si",
    "emails": [
      "eva.anzlovar",
      "eva.dernovsek@otpbanka.si",
      "Tilen.tebuc@otpbanka.si",
      "eva.anzlovar@otpbanka.si",
      "klavdija.kac@otpbanka.si"
    ],
    "address": "Slovenska cesta 58, \n1000 Ljubljana",
    "addresses": [
      "Ulica Vita Kraigherja 4\n2000 Maribor",
      "Slovenska 58\n1000Ljubljana",
      "Slovenska 58\n1000 Ljubljana",
      "Slovenska cesta 58\n1000 Ljubljana",
      "Slovenska cesta 58, \n1000 Ljubljana"
    ],
    "code": ""
  },
  "prinux": {
    "name": "Prinux",
    "email": "info@prinux.com",
    "emails": [
      "info@prinux.com"
    ],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "heser d.o.o.": {
    "name": "HESER d.o.o.",
    "email": "mojca.spes@heser.si",
    "emails": [
      "mojca.spes@heser.si"
    ],
    "address": "Levec 71C\n3301 Petrovče",
    "addresses": [
      "Levec 71C\n3301 Petrovče"
    ],
    "code": ""
  },
  "vendo": {
    "name": "VENDO",
    "email": "sabine.ortner@vendo.at",
    "emails": [
      "sara.hessenberger@vendo.at",
      "georg.freilinger@vendo.at",
      "thomas.rigler@vendo.at",
      "dietmar.willingstorfer@vendo.at",
      "rudolf.penetsdorfer@vendo.at",
      "michael.pfeiffer@vendo.at",
      "sabine.ortner@vendo.at"
    ],
    "address": "Kommunikation + Druck GmbH\nGutenbergstrasse 2\n4840  Vöcklabruck",
    "addresses": [
      "Kommunikation + Druck GmbH\nGutenbergstrasse 2\n4840  Vöcklabruck"
    ],
    "code": ""
  },
  "ldd communication gmbh": {
    "name": "LDD Communication GmbH",
    "email": "elisa.haberl@ldd.at",
    "emails": [
      "elisa.haberl",
      "elisa.haberl@ldd.at"
    ],
    "address": "Gewerbegebiet Süd 1\n4664  Oberweis-Gmunden",
    "addresses": [
      "Gewerbegebiet Süd 1\n4664  Oberweis-Gmunden"
    ],
    "code": ""
  },
  "blaž": {
    "name": "BLAŽ",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "glasbena šola slovenske konjice": {
    "name": "Glasbena šola Slovenske Konjice",
    "email": "",
    "emails": [],
    "address": "Tattenbachova ulica 1a\n3210 Slovenske Konjice",
    "addresses": [
      "Tattenbachova ulica 1a\n3210 Slovenske Konjice"
    ],
    "code": ""
  },
  "meisterwerk": {
    "name": "Meisterwerk",
    "email": "office@meister-werk.at",
    "emails": [
      "office@meister-werk.at"
    ],
    "address": "Nad gramoznico 14\nMiklavž na Dravskem polju",
    "addresses": [
      "Nad gramoznico 14\nMiklavž na Dravskem polju"
    ],
    "code": ""
  },
  "belupo d.o.o.": {
    "name": "BELUPO d.o.o.",
    "email": "gasper.senica@belupo.si",
    "emails": [
      "gasper.senica@belupo.si"
    ],
    "address": "Dvorakova ulica 6\n1000 Ljubljana",
    "addresses": [
      "Dvorakova ulica 6\n1000 Ljubljana"
    ],
    "code": ""
  },
  "vrtec slovenske konjice": {
    "name": "VRTEC SLOVENSKE KONJICE",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "sanctum": {
    "name": "SANCTUM",
    "email": "alenka@sanctum.si",
    "emails": [
      "alenka@sanctum.si"
    ],
    "address": "Lipoglav 71\n3215 Loče",
    "addresses": [
      "Lipoglav 71\n3215 Loče"
    ],
    "code": ""
  },
  "tcc plus": {
    "name": "TCC PLUS",
    "email": "",
    "emails": [],
    "address": "Kosovelova ul. 16\n3000 Celje",
    "addresses": [
      "Kosovelova ul. 16\n3000 Celje"
    ],
    "code": ""
  },
  "obrtna zbornica sk": {
    "name": "Obrtna zbornica SK",
    "email": "mateja.kosir@ozs.si",
    "emails": [
      "mateja.kosir@ozs.si"
    ],
    "address": "Celjska cesta 2, \n3210 Slovenske Konjice",
    "addresses": [
      "Celjska cesta 2, \n3210 Slovenske Konjice"
    ],
    "code": ""
  },
  "ptujska tiskarna (ino)": {
    "name": "PTUJSKA TISKARNA (INO)",
    "email": "",
    "emails": [],
    "address": "INO - Ptujska tiskarna",
    "addresses": [
      "INO - Ptujska tiskarna"
    ],
    "code": ""
  },
  "grafika adt": {
    "name": "Grafika ADT",
    "email": "martina.pavsictriera.net",
    "emails": [
      "martina.pavsictriera.net"
    ],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "sž tovorni promet": {
    "name": "SŽ Tovorni promet",
    "email": "",
    "emails": [],
    "address": "Zaloška cesta 214\n1000 Ljubljana",
    "addresses": [
      "Zaloška cesta 214\n1000 Ljubljana"
    ],
    "code": ""
  },
  "enset": {
    "name": "ENSET",
    "email": "",
    "emails": [],
    "address": "Kraigherjeva ulica 22\n2230 Lenart v Slovenskih goricah",
    "addresses": [
      "Kraigherjeva ulica 22\n2230 Lenart v Slovenskih goricah"
    ],
    "code": ""
  },
  "maja stanojevič": {
    "name": "Maja Stanojevič",
    "email": "maja.stanojevic@gmail.com",
    "emails": [
      "maja.stanojevic@gmail.com"
    ],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "grawe zavarovalnica": {
    "name": "GRAWE zavarovalnica",
    "email": "nik.pek@grawe.si",
    "emails": [
      "nik.pek@grawe.si"
    ],
    "address": "Gregorčičeva 39\n2000 Maribor",
    "addresses": [
      "Gregorčičeva 39\n2000 Maribor"
    ],
    "code": ""
  },
  "deltex": {
    "name": "Deltex",
    "email": "deltex.d@siol.net",
    "emails": [
      "deltex.d@siol.net"
    ],
    "address": "Močilnik 1\n1360 Vrhnika",
    "addresses": [
      "Močilnik 1\n1360 Vrhnika"
    ],
    "code": ""
  },
  "petric": {
    "name": "PETRIC",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "skb leasing d.o.o.": {
    "name": "SKB Leasing d.o.o.",
    "email": "bojana.marincek@skb-leasing.si",
    "emails": [
      "bojana.marincek@skb-leasing.si"
    ],
    "address": "Služba za podporo SKB Leasing Selecta\nAjdovščina 4\n1000 Ljubljana",
    "addresses": [
      "Oddelek za financiranje zalog\nAjdovščina 4\n1000 Ljubljana",
      "Služba za podporo SKB Leasing Selecta\nAjdovščina 4\n1000 Ljubljana"
    ],
    "code": ""
  },
  "diamant plus": {
    "name": "DIAMANT PLUS",
    "email": "info@diamantplus.si",
    "emails": [
      "info@diamantplus.si"
    ],
    "address": "Stara cesta 20\nDomžale",
    "addresses": [
      "Stara cesta 20\nDomžale"
    ],
    "code": ""
  },
  "grafoline": {
    "name": "GRAFOLINE",
    "email": "ursa@grafoline.si",
    "emails": [
      "ursa@grafoline.si"
    ],
    "address": "Cesta na Roglo 71\n3241 Zreče",
    "addresses": [
      "Cesta na Roglo 71\n3241 Zreče"
    ],
    "code": ""
  },
  "delfin hotel zdus": {
    "name": "DELFIN HOTEL ZDUS",
    "email": "Vodja.prodaje@hotel-delfin.si",
    "emails": [
      "Vodja.prodaje@hotel-delfin.si"
    ],
    "address": "TOMAŽIČEVA ULICA 10, \n6310 IZOLA",
    "addresses": [
      "TOMAŽIČEVA ULICA 10, \n6310 IZOLA"
    ],
    "code": ""
  },
  "adam": {
    "name": "ADAM",
    "email": "daniela.spiessberger@ad-am.at",
    "emails": [
      "ajla@ad-am.at",
      "srath@ad-am.at",
      "daniela.spiessberger@ad-am.at"
    ],
    "address": "Großalmstraße 4\n4813  Altmünster am Traundee",
    "addresses": [
      "Großalmstraße 4\n4813  Altmünster am Traundee"
    ],
    "code": ""
  },
  "hotel mons": {
    "name": "HOTEL MONS",
    "email": "anja.hribar@fourpointljubljana.com",
    "emails": [
      "anja.hribar@fourpointljubljana.com"
    ],
    "address": "Pot za Brdom 4\n1000 Ljubljana",
    "addresses": [
      "Pot za Brdom 4\n1000 Ljubljana"
    ],
    "code": ""
  },
  "servier": {
    "name": "SERVIER",
    "email": "milena.kus@servier.com",
    "emails": [
      "milena.kus@servier.com"
    ],
    "address": "Podmilščakova ulica 24\n1000 Ljubljana",
    "addresses": [
      "Podmilščakova ulica 24\n1000 Ljubljana"
    ],
    "code": ""
  },
  "ldd": {
    "name": "LDD",
    "email": "nina.eichmayr@ldd.at",
    "emails": [
      "elisa.haberl@ldd.at",
      "noelle.dutzer@ldd.at",
      "claudia.wallinger@ldd.at",
      "nina.eichmayr@ldd.at"
    ],
    "address": "Gewerbegebiet Süd 1\n4664  Oberweis-Gmunden",
    "addresses": [
      "Gewerbegebiet Süd 1\n4664  Oberweis-Gmunden"
    ],
    "code": ""
  },
  "pliva": {
    "name": "PLIVA",
    "email": "dejan.djelovic@tevasi.si",
    "emails": [
      "matjaz.ficko@tevasi.si",
      "dejan.djelovic@tevasi.si"
    ],
    "address": "Ameriška ulica 2\n1000  Ljubljana",
    "addresses": [
      "Ameriška ulica 2\n1000  Ljubljana"
    ],
    "code": ""
  },
  "jgl": {
    "name": "JGL",
    "email": "ursa.licer@jgl.si",
    "emails": [
      "ursa.licer@jgl.si"
    ],
    "address": "Litostrojska cesta 46A\n1000 Ljubljana",
    "addresses": [
      "Litostrojska cesta 46A\n1000 Ljubljana"
    ],
    "code": ""
  },
  "styria": {
    "name": "STYRIA",
    "email": "martin.cuk@styria.com",
    "emails": [
      "josip.novak@styria.com",
      "martin.cuk@styria.com"
    ],
    "address": "Styriastraße 20 \n8042 Graz",
    "addresses": [
      "Styriastraße 20 \n8042 Graz"
    ],
    "code": ""
  },
  "idshop": {
    "name": "IDSHOP",
    "email": "mateja.mirtic@idshop.si",
    "emails": [
      "mateja.mirtic@idshop.si"
    ],
    "address": "Litostrojska 44d\n1000 Ljubljana",
    "addresses": [
      "Litostrojska 44d\n1000 Ljubljana"
    ],
    "code": ""
  },
  "vsg direkt": {
    "name": "VSG Direkt",
    "email": "",
    "emails": [],
    "address": "Industriestraße B 18 \n2345 Brunn am Gebirge",
    "addresses": [
      "Industriestraße B 18 \n2345 Brunn am Gebirge"
    ],
    "code": ""
  },
  "peter domokos": {
    "name": "PETER DOMOKOS",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "jh innovations gmbh": {
    "name": "JH Innovations GmbH",
    "email": "joachim.hackel@jh-innovations.de",
    "emails": [
      "joachim.hackel@jh-innovations.de"
    ],
    "address": "Berliner Straße 22a\nD-68161 Mannheim",
    "addresses": [
      "Berliner Straße 22a\nD-68161 Mannheim"
    ],
    "code": ""
  },
  "hotel allmer pfeiler hotelbetriebs gmbh": {
    "name": "Hotel Allmer Pfeiler Hotelbetriebs gmbH",
    "email": "p.pfeiler@allmer-hotel.at",
    "emails": [
      "p.pfeiler@allmer-hotel.at"
    ],
    "address": "Kaiser-Franz-Josef-Straße 12\nA-8344 Bad Gleichenberg",
    "addresses": [
      "Kaiser-Franz-Josef-Straße 12\nA-8344 Bad Gleichenberg"
    ],
    "code": ""
  },
  "kainoto": {
    "name": "KAINOTO",
    "email": "natalija@kainoto.com",
    "emails": [
      "natalija@kainoto.com"
    ],
    "address": "Kočevarjeva ulica 7\n2000 Maribor",
    "addresses": [
      "Kočevarjeva ulica 7\n2000 Maribor"
    ],
    "code": ""
  },
  "kreativna pika": {
    "name": "KREATIVNA PIKA",
    "email": "nina@kreativnapika.si",
    "emails": [
      "nina@kreativnapika.si"
    ],
    "address": "Kraigherjeva ulica 4a\n2230 Lenart v Slov. goricah",
    "addresses": [
      "Kraigherjeva ulica 4a\n2230 Lenart v Slov. goricah"
    ],
    "code": ""
  },
  "weiler": {
    "name": "Weiler",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "weiler abrasives d.o.o.": {
    "name": "WEILER Abrasives d.o.o.",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "atelje": {
    "name": "ATELJE",
    "email": "repro@atelje.si",
    "emails": [
      "repro@atelje.si"
    ],
    "address": "Atelier A d.o.o\nPrešernova ulica 14\nMurska Sobota",
    "addresses": [
      "Atelier A d.o.o\nPrešernova ulica 14\nMurska Sobota"
    ],
    "code": ""
  },
  "studio fakin": {
    "name": "Studio FAKIN",
    "email": "",
    "emails": [],
    "address": "Stari trg 33\n3210 Slovenske Konjice",
    "addresses": [
      "Stari trg 33\n3210 Slovenske Konjice"
    ],
    "code": ""
  },
  "simona glavič": {
    "name": "Simona Glavič",
    "email": "simona@brandbond79.si",
    "emails": [
      "simona@brandbond79.si"
    ],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "novolux": {
    "name": "NOVOLUX",
    "email": "prodaja@novolux.si",
    "emails": [
      "prodaja@novolux.si"
    ],
    "address": "Bistriška cesta 99 \n2319 Poljčane",
    "addresses": [
      "Bistriška cesta 99 \n2319 Poljčane"
    ],
    "code": ""
  },
  "društvo kmečkih žena oplotnica": {
    "name": "DRUŠTVO KMEČKIH ŽENA OPLOTNICA",
    "email": "bernarda2vs@gmail.com",
    "emails": [
      "bernarda2vs@gmail.com"
    ],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "ciciban": {
    "name": "CICIBAN",
    "email": "tina.velikonja@ciciban.info",
    "emails": [
      "tina.velikonja@ciciban.info"
    ],
    "address": "AFIT d.o.o., \nMiren 129, \n5291 Miren,",
    "addresses": [
      "AFIT d.o.o., \nMiren 129, \n5291 Miren,"
    ],
    "code": ""
  },
  "cukrov": {
    "name": "CUKROV",
    "email": "administracija@cukrov.eu",
    "emails": [
      "administracija@cukrov.eu"
    ],
    "address": "Tivolska 48, \n1000 Ljubljana, Slovenija",
    "addresses": [
      "Tivolska 48, \n1000 Ljubljana, Slovenija"
    ],
    "code": ""
  },
  "otp leasing": {
    "name": "OTP Leasing",
    "email": "manca.sikosek@otplesing.si",
    "emails": [
      "manca.sikosek@otplesing.si"
    ],
    "address": "Ajdovščina 4\n1000 Ljubljana",
    "addresses": [
      "Ajdovščina 4\n1000 Ljubljana"
    ],
    "code": ""
  },
  "afrodita": {
    "name": "AFRODITA",
    "email": "simona.podgornik@kozmetika-af",
    "emails": [
      "simona.podgornik@kozmetika-af"
    ],
    "address": "Kozmetika Afrodita\nKidričeva 54\n3250 Rogaška Slatina",
    "addresses": [
      "Kozmetika Afrodita\nKidričeva 54\n3250 Rogaška Slatina"
    ],
    "code": ""
  },
  "smreka": {
    "name": "Smreka",
    "email": "",
    "emails": [],
    "address": "",
    "addresses": [],
    "code": ""
  },
  "kemoplast": {
    "name": "Kemoplast",
    "email": "petra.lapornik@kemoplast.si",
    "emails": [
      "petra.lapornik@kemoplast.si"
    ],
    "address": "Drofenikova 7\n3230 Šentjur",
    "addresses": [
      "Drofenikova 7\n3230 Šentjur"
    ],
    "code": ""
  },
  "lelosi uvecto d.o.o.": {
    "name": "Lelosi UVECTO d.o.o.",
    "email": "mateja.zivoder@lelosi.com",
    "emails": [
      "mateja.zivoder@lelosi.com"
    ],
    "address": "Kovinarska cesta 4\n1241 Kamnik",
    "addresses": [
      "Kovinarska cesta 4\n1241 Kamnik"
    ],
    "code": ""
  }
};
