import os, json

dirs = [r'S:\PONUDBE TEST', r'\\server-2012\Srecko\PONUDBE TEST']
cust_map = {}
for d in dirs:
    if os.path.exists(d):
        for f in os.listdir(d):
            if f.endswith('.json'):
                p = os.path.join(d, f)
                try:
                    with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                        data = json.load(fp)
                        c = (data.get('customer') or '').strip()
                        em = (data.get('custEmail') or '').strip()
                        adr = (data.get('custAddress') or '').strip()
                        code = (data.get('customerCode') or '').strip()
                        if c:
                            ckey = c.lower()
                            if ckey not in cust_map:
                                cust_map[ckey] = {'name': c, 'emails': set(), 'addresses': set(), 'codes': set()}
                            if em:
                                for part in em.replace(';', ',').split(','):
                                    part = part.strip()
                                    if part:
                                        cust_map[ckey]['emails'].add(part)
                            if adr:
                                cust_map[ckey]['addresses'].add(adr)
                            if code:
                                cust_map[ckey]['codes'].add(code)
                except:
                    pass
        break

print(f'Total customers found on disk: {len(cust_map)}')
multi_email_custs = {k: v for k, v in cust_map.items() if len(v['emails']) > 1}
print(f'Customers with multiple emails: {len(multi_email_custs)}')
for k, v in list(multi_email_custs.items())[:15]:
    print(f"{v['name']}: {list(v['emails'])}")
