import os
from supabase import create_client, Client
from dotenv import load_dotenv
import httpx

# --- VERCEL CORS/PROXY PATCH ---
# This fixes the "TypeError: Client.__init__() got an unexpected keyword argument 'proxy'"
# that occurs due to version mismatches in the Vercel Python runtime.
original_init = httpx.Client.__init__
def patched_init(self, *args, **kwargs):
    if 'proxy' in kwargs:
        # Move 'proxy' to 'proxy' or 'proxies' depending on what is expected
        # or just remove it if it's causing a crash in this environment.
        kwargs.pop('proxy')
    return original_init(self, *args, **kwargs)
httpx.Client.__init__ = patched_init
# -------------------------------

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Create client only if variables exist, or handle gracefully in nodes
supabase = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
else:
    print("---WARNING: Missing Supabase environment variables---")