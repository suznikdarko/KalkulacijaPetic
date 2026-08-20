import os

desktop_paths = [
    os.path.expanduser("~/Desktop"),
    os.path.expanduser("~/OneDrive/Desktop"),
    os.path.expanduser("~/OneDrive - Spletne rešitve/Desktop"), # or similar OneDrive paths if they exist
    "C:\\Users\\Prodaja\\Desktop",
    "C:\\Users\\Darko\\Desktop",
    "C:\\Users\\Public\\Desktop"
]

for dp in desktop_paths:
    if os.path.exists(dp):
        print(f"--- Listing Desktop: {dp} ---")
        try:
            for item in os.listdir(dp):
                print(item)
        except Exception as e:
            print(f"Error: {e}")
