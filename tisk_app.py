import sys
import subprocess
from datetime import datetime

# Poskus uvoza customtkinterja, če ni nameščen, se namesti avtomatsko
try:
    import customtkinter as ctk
except ImportError:
    print("Nameščam 'customtkinter' knjižnico, prosim počakajte...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "customtkinter"])
    import customtkinter as ctk

# Nastavitve vizualne teme
ctk.set_appearance_mode("System")  # Tema se prilagodi operacijskemu sistemu (Dark/Light)
ctk.set_default_color_theme("blue")  # Osnovna barva ("blue", "green", "dark-blue")

class TiskApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Konfiguracija okna
        self.title("Kalkulator Tiska (Zavihek: S4 4-0)")
        self.geometry("450x450")
        self.grid_columnconfigure(0, weight=1)

        # Naslov
        self.title_label = ctk.CTkLabel(self, text="Izračun stroškov tiska", font=ctk.CTkFont(size=24, weight="bold"))
        self.title_label.grid(row=0, column=0, padx=20, pady=(30, 0))

        # Datum
        self.date_label = ctk.CTkLabel(self, text=f"Datum: {datetime.now().strftime('%d.%m.%Y')}", font=ctk.CTkFont(size=14))
        self.date_label.grid(row=1, column=0, padx=20, pady=(0, 10))

        # Okvir za vnos
        self.vnos_frame = ctk.CTkFrame(self)
        self.vnos_frame.grid(row=2, column=0, padx=30, pady=10, sticky="ew")
        self.vnos_frame.grid_columnconfigure(1, weight=1)

        self.naklada_label = ctk.CTkLabel(self.vnos_frame, text="Vnesi naklado:", font=ctk.CTkFont(size=16))
        self.naklada_label.grid(row=0, column=0, padx=15, pady=20)

        self.naklada_entry = ctk.CTkEntry(self.vnos_frame, placeholder_text="Število kosov...")
        self.naklada_entry.grid(row=0, column=1, padx=15, pady=20, sticky="ew")
        # Pritisk na Enter izvede izračun
        self.naklada_entry.bind("<Return>", self.izracunaj)

        # Gumb za izračun
        self.calc_button = ctk.CTkButton(self, text="Izračunaj ceno", command=self.izracunaj, font=ctk.CTkFont(size=16, weight="bold"), height=40)
        self.calc_button.grid(row=3, column=0, padx=20, pady=15)

        # Okvir za rezultate
        self.result_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.result_frame.grid(row=4, column=0, padx=30, pady=10, sticky="nsew")
        self.result_frame.grid_columnconfigure(1, weight=1)

        # Prikaz rezultatov materiala (Pol za tisk)
        self.lbl_tisk_opis = ctk.CTkLabel(self.result_frame, text="Poli za tisk (TISK):", font=ctk.CTkFont(size=16))
        self.lbl_tisk_opis.grid(row=0, column=0, padx=10, pady=(15, 10), sticky="w")
        self.lbl_tisk_val = ctk.CTkLabel(self.result_frame, text="-", font=ctk.CTkFont(size=18, weight="bold"))
        self.lbl_tisk_val.grid(row=0, column=1, padx=10, pady=(15, 10), sticky="e")

        # Prikaz določene končne cene
        self.lbl_cena_opis = ctk.CTkLabel(self.result_frame, text="Cena tiska:", font=ctk.CTkFont(size=18))
        self.lbl_cena_opis.grid(row=1, column=0, padx=10, pady=(10, 20), sticky="w")
        self.lbl_cena_val = ctk.CTkLabel(self.result_frame, text="-", font=ctk.CTkFont(size=26, weight="bold"), text_color=["#1f6aa5", "#3a7ebf"])
        self.lbl_cena_val.grid(row=1, column=1, padx=10, pady=(10, 20), sticky="e")

    def izracunaj(self, event=None):
        vnos = self.naklada_entry.get().strip()
        
        try:
            # Preverjanje vnosa
            naklada = int(vnos)
            if naklada < 1:
                raise ValueError
        except ValueError:
            self.lbl_tisk_val.configure(text="Neveljaven vnos!")
            self.lbl_cena_val.configure(text="Neveljaven vnos!")
            return

        # ==========================================================
        # FORMULE IZ EXCELA (zavihek: S4 4-0)
        # ==========================================================

        # K stolpec (TISK): =0.2501*A_naklada + 319.73
        tisk_kolicina = 0.2501 * naklada + 319.73
        
        # M stolpec (CENA):
        # do vključno 3000:       0.0042 * Naklada + 21.332
        # nad 3000 do 6500 vklj.: 0.000004 * Naklada + 33.985
        # nad 6500:               0.0043 * Naklada + 5.3092
        if naklada <= 3000:
            cena = 0.0042 * naklada + 21.332
        elif naklada <= 6500:
            cena = 0.000004 * naklada + 33.985
        else:
            cena = 0.0043 * naklada + 5.3092

        # ==========================================================

        # Posodobitev grafičnega prikaza z rezultati
        self.lbl_tisk_val.configure(text=f"{int(round(tisk_kolicina))} listov")
        self.lbl_cena_val.configure(text=f"{cena:.2f} €")

if __name__ == "__main__":
    app = TiskApp()
    app.mainloop()
