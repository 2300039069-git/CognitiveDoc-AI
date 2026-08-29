import os
import requests
import json
import re

api_key = os.getenv("GROQ_API_KEY", "")
headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}

prompt = """
Document Excerpt:
CLINICAL TRIAL PROTOCOL REPORT: NEUROTECH PHASE III STUDY (2026)
Patients receiving NT-502 exhibited a 42.6% improvement in cognitive retrieval indices relative to the placebo baseline.
Mild transient headaches occurred in 4.2% of subjects. No severe adverse events were recorded.

Generate a JSON object with:
- executive_summary (string)
- bullet_points (array of strings)
- key_takeaways (array of strings)
- entities (array of strings)
"""

for model in ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]:
    data = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are an enterprise AI document analyst. Return ONLY a valid JSON object matching the requested schema."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "max_tokens": 1000
    }
    res = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=data, timeout=15)
    print(f"\n--- MODEL: {model} ---")
    raw = res.json()["choices"][0]["message"]["content"]
    print("RAW:", raw)
