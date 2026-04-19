from fastapi import Header, HTTPException
from supabase_client import supabase

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or malformed Authorization header")

    token = authorization.split(" ")[1]

    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        return user.user.id
    except Exception as e:
        # If this STILL fails after updating keys, it means the Service Role key is definitely wrong.
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")