import sys
import hashlib
import urllib.request
import os

def check_external_api(target_hash):
    try:
        req = urllib.request.Request(
            f"https://nitrxgen.net/md5db/{target_hash}", 
            headers={'User-Agent': 'Mozilla/5.0 CTF-Toolkit/1.0'}
        )
        response = urllib.request.urlopen(req, timeout=3)
        result = response.read().decode('utf-8').strip()
        if result:
            return result
    except Exception:
        pass
    return None

def crack_hash(target_hash, wordlist_path=None):
    hash_len = len(target_hash)
    hash_type = None
    if hash_len == 32:
        hash_type = 'md5'
    elif hash_len == 40:
        hash_type = 'sha1'
    elif hash_len == 64:
        hash_type = 'sha256'
    else:
        return None, "Unknown"

    # Resolve wordlist to use
    if not wordlist_path or not os.path.exists(wordlist_path):
        wordlist_path = os.path.join(os.path.dirname(__file__), 'wordlist.txt')

    print(f"[*] Wordlist : {wordlist_path}")
    print(f"[*] Hash Type: {hash_type.upper()}")

    if os.path.exists(wordlist_path):
        count = 0
        with open(wordlist_path, 'r', encoding='latin-1') as f:
            for line in f:
                pwd = line.strip()
                if not pwd:
                    continue
                h = hashlib.new(hash_type)
                h.update(pwd.encode('utf-8', errors='replace'))
                count += 1
                if h.hexdigest().lower() == target_hash.lower():
                    print(f"[*] Tried {count} passwords before cracking.")
                    return pwd, hash_type
        print(f"[*] Wordlist exhausted after {count} attempts.")
    else:
        print(f"[-] Wordlist not found: {wordlist_path}")

    if hash_type == 'md5':
        api_res = check_external_api(target_hash)
        if api_res:
            return api_res, "md5 (nitrxgen API)"
            
    return None, hash_type

# ── Entry point ──────────────────────────────────────────────────────────────
if '--hash' not in sys.argv:
    print("John/Hashcat Mock Cracker v3.0")
    print("Usage: --hash <hash> [--wordlist <path>]")
    sys.exit(0)

target_index = sys.argv.index('--hash') + 1
if target_index >= len(sys.argv):
    print("Missing hash argument")
    sys.exit(1)

target = sys.argv[target_index]

# Optional custom wordlist
custom_wl = None
if '--wordlist' in sys.argv:
    wl_index = sys.argv.index('--wordlist') + 1
    if wl_index < len(sys.argv):
        wl_arg = sys.argv[wl_index]
        # Ignore meta-values that come from the frontend
        if wl_arg not in ('default', 'rockyou', 'custom', 'paste'):
            custom_wl = wl_arg
        elif wl_arg == 'rockyou':
            # Try rockyou.txt in same directory
            rockyou = os.path.join(os.path.dirname(__file__), 'rockyou.txt')
            if os.path.exists(rockyou):
                custom_wl = rockyou
            else:
                print(f"[!] rockyou.txt not found at {rockyou}. Falling back to default wordlist.")

print(f"[*] Engine initializing...")
print(f"[*] Target Hash: {target}")

pwd, htype = crack_hash(target, custom_wl)

if pwd:
    print(f"\n[+] STATUS : CRACKED!")
    print(f"    ALGO   : {htype.upper()}")
    print(f"    SECRET : {pwd}")
    print(f"    OUTPUT : {target}:{pwd}")
else:
    print(f"\n[-] STATUS : EXHAUSTED")
    print(f"    REASON : Hash not found in wordlist or rainbow tables.")
