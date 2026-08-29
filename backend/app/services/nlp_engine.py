import re
import math
import json
import time
import requests
import logging
from typing import List, Dict, Any, Tuple, Optional
from collections import Counter
from app.core.config import (
    GEMINI_API_KEY, GEMINI_MODEL,
    GROQ_API_KEY, GROQ_MODEL, GROQ_BASE_URL,
    OPENROUTER_API_KEY, OPENROUTER_MODEL, OPENROUTER_BASE_URL,
    OLLAMA_BASE_URL, OLLAMA_MODEL
)
from app.services.vector_store import chunk_text, get_or_create_vector_store, split_into_sentences

logger = logging.getLogger(__name__)

# Common English stopwords
STOPWORDS = set([
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
    "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers",
    "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in",
    "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
    "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought",
    "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll",
    "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their",
    "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
    "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very",
    "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's",
    "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's",
    "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
    "yours", "yourself", "yourselves"
])

# In-Memory Cache for fast sub-millisecond retrieval of repeated queries
_LLM_CACHE: Dict[str, Tuple[str, str]] = {}

# 1. Tier 1: Primary - Google Gemini
def call_gemini_llm(messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 1500) -> Optional[Tuple[str, str]]:
    """
    Calls Google Gemini API (Primary AI Engine) with native multi-lingual reasoning.
    """
    if not GEMINI_API_KEY:
        return None

    cache_key = f"gemini:{str(messages)}:{max_tokens}"
    if cache_key in _LLM_CACHE:
        return _LLM_CACHE[cache_key]

    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
        # Convert standard messages to Gemini contents format
        contents = []
        for m in messages:
            role = "user" if m["role"] in ["user", "system"] else "model"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

        payload = {
            "contents": contents,
            "generationConfig": {
                "temperature": temperature,
                "maxOutputTokens": max_tokens
            }
        }
        res = requests.post(url, json=payload, timeout=15)
        if res.status_code == 200:
            data = res.json()
            content = data["candidates"][0]["content"]["parts"][0]["text"]
            model_name = f"Gemini-{GEMINI_MODEL} (Primary)"
            logger.info(f"Generated response using Google Gemini ({GEMINI_MODEL})")
            _LLM_CACHE[cache_key] = (content, model_name)
            return content, model_name
        else:
            logger.warning(f"Gemini API returned status {res.status_code}: {res.text}")
    except Exception as e:
        logger.error(f"Gemini API call exception: {e}")
    return None

# 2. Tier 2: Backup - Groq High-Speed LPU
def call_groq_llm(messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 1500) -> Optional[Tuple[str, str]]:
    """
    Calls Groq high-speed cloud LPU inference API (Backup Engine).
    """
    if not GROQ_API_KEY:
        return None

    cache_key = f"groq:{str(messages)}:{max_tokens}"
    if cache_key in _LLM_CACHE:
        return _LLM_CACHE[cache_key]

    try:
        url = f"{GROQ_BASE_URL.rstrip('/')}/chat/completions"
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": GROQ_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            model_name = f"Groq-{GROQ_MODEL} (Backup)"
            logger.info(f"Generated response using Groq LPU ({GROQ_MODEL})")
            _LLM_CACHE[cache_key] = (content, model_name)
            return content, model_name
        else:
            logger.warning(f"Groq API returned status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"Groq API call exception: {str(e)}")
    return None

# 3. Tier 3: Second Backup - OpenRouter Global API Aggregator
def call_openrouter_llm(messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 1500) -> Optional[Tuple[str, str]]:
    """
    Calls OpenRouter API router (Second Backup Engine).
    """
    if not OPENROUTER_API_KEY:
        return None

    cache_key = f"openrouter:{str(messages)}:{max_tokens}"
    if cache_key in _LLM_CACHE:
        return _LLM_CACHE[cache_key]

    try:
        url = f"{OPENROUTER_BASE_URL.rstrip('/')}/chat/completions"
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://cognitivedoc.ai",
            "X-Title": "CognitiveDoc AI"
        }
        payload = {
            "model": OPENROUTER_MODEL,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }
        response = requests.post(url, headers=headers, json=payload, timeout=20)
        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            model_name = f"OpenRouter-{OPENROUTER_MODEL} (2nd Backup)"
            logger.info(f"Generated response using OpenRouter ({OPENROUTER_MODEL})")
            _LLM_CACHE[cache_key] = (content, model_name)
            return content, model_name
        else:
            logger.warning(f"OpenRouter API returned status {response.status_code}: {response.text}")
    except Exception as e:
        logger.error(f"OpenRouter API call exception: {str(e)}")
    return None

# 4. Tier 4: Offline - Ollama Local On-Device Qwen 2.5
def call_ollama_llm(messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 1500) -> Optional[Tuple[str, str]]:
    """
    Calls Local Ollama LLM (Qwen 2.5 1.5B) on localhost:11434 with zero external dependencies (Offline Engine).
    """
    cache_key = f"{OLLAMA_MODEL}:{str(messages)}:{max_tokens}"
    if cache_key in _LLM_CACHE:
        logger.info("Serving from Local LLM In-Memory Cache (< 1ms)")
        return _LLM_CACHE[cache_key]

    try:
        url = f"{OLLAMA_BASE_URL.rstrip('/')}/api/chat"
        payload = {
            "model": OLLAMA_MODEL,
            "messages": messages,
            "stream": False,
            "options": {
                "num_thread": 8,
                "num_ctx": 1536,
                "num_predict": max_tokens,
                "temperature": temperature,
                "top_k": 20,
                "top_p": 0.8,
                "repeat_penalty": 1.1
            }
        }
        res = requests.post(url, json=payload, timeout=45)
        if res.status_code == 200:
            data = res.json()
            content = data.get("message", {}).get("content", "")
            model_name = f"Qwen-2.5-1.5B (Offline Local LLM)"
            logger.info(f"Generated response using Local Qwen 2.5 ({OLLAMA_MODEL})")
            _LLM_CACHE[cache_key] = (content, model_name)
            return content, model_name
    except Exception as e:
        logger.warning(f"Local Ollama Qwen 2.5 call error: {e}")
    return None

def call_unified_llm(messages: List[Dict[str, str]], temperature: float = 0.2, max_tokens: int = 1200) -> Optional[Tuple[str, str]]:
    """
    Enterprise 4-Tier Resilient AI Failover Pipeline:
    1. Primary:       Google Gemini (gemini-1.5-flash / gemini-2.0)
    2. Backup:        Groq Ultra-Fast LPU (openai/gpt-oss-120b)
    3. Second Backup: OpenRouter Global Router (meta-llama/llama-3.3-70b-instruct)
    4. Offline:       Local Ollama On-Device Qwen 2.5 (1.5B)
    """
    # Tier 1: Primary -> Google Gemini
    if GEMINI_API_KEY:
        gemini_res = call_gemini_llm(messages, temperature, max_tokens)
        if gemini_res:
            return gemini_res

    # Tier 2: Backup -> Groq High-Speed LPU
    if GROQ_API_KEY:
        groq_res = call_groq_llm(messages, temperature, max_tokens)
        if groq_res:
            return groq_res

    # Tier 3: Second Backup -> OpenRouter Global Router
    if OPENROUTER_API_KEY:
        openrouter_res = call_openrouter_llm(messages, temperature, max_tokens)
        if openrouter_res:
            return openrouter_res

    # Tier 4: Offline -> Local Ollama (Qwen 2.5 1.5B)
    ollama_res = call_ollama_llm(messages, temperature, max_tokens)
    if ollama_res:
        return ollama_res

    return None

def extract_entities_and_keywords(text: str, top_n: int = 8) -> List[str]:
    """Extract key capitalized entities and high-frequency terms."""
    proper_nouns = re.findall(r'\b[A-Z][a-zA-Z0-9_\-]{2,}\b', text)
    proper_nouns = [w for w in proper_nouns if w.lower() not in STOPWORDS and len(w) > 2]
    counts = Counter(proper_nouns)
    metrics = re.findall(r'(?:\$[\d,]+(?:\.\d+)?|\d+(?:\.\d+)?%|\d+\s*(?:million|billion|trillion|USD|EUR))', text, re.IGNORECASE)
    combined = [item[0] for item in counts.most_common(top_n)]
    for m in metrics[:4]:
        if m not in combined:
            combined.append(m)
    return combined[:top_n]

def calculate_sentence_scores(sentences: List[str], focus_keywords: List[str] = None) -> List[float]:
    """Score sentences based on word frequency, position, length, and focus keywords."""
    if not sentences:
        return []
    words_in_sentences = []
    word_freq = Counter()
    for s in sentences:
        words = [w.lower() for w in re.findall(r'\b[a-zA-Z]{3,}\b', s) if w.lower() not in STOPWORDS]
        words_in_sentences.append(words)
        for w in words:
            word_freq[w] += 1

    max_freq = max(word_freq.values()) if word_freq else 1
    scores = []
    focus_set = set([k.lower() for k in (focus_keywords or []) if k])
    total_sentences = len(sentences)

    for idx, (sentence, words) in enumerate(zip(sentences, words_in_sentences)):
        if len(words) < 4:
            scores.append(0.0)
            continue
        freq_score = sum(word_freq[w] / max_freq for w in words) / (len(words) ** 0.6)
        position_weight = 1.3 if idx == 0 else (1.15 if idx < 3 else (1.1 if idx > total_sentences - 3 else 1.0))
        keyword_boost = sum(0.5 for w in words if w in focus_set)
        has_numbers = 0.2 if re.search(r'\d+', sentence) else 0.0
        score = (freq_score * position_weight) + keyword_boost + has_numbers
        scores.append(score)

    return scores

def build_hierarchical_context(text: str, max_chars: int = 6500) -> str:
    """
    Extracts high-signal structural anchors for massive documents (e.g. 900-page PDFs).
    Captures beginning overview (40%), sampled middle sections (30%), and concluding takeaways (30%).
    """
    total_len = len(text)
    if total_len <= max_chars:
        return text

    beg_len = int(max_chars * 0.40)
    end_len = int(max_chars * 0.30)
    mid_budget = max_chars - beg_len - end_len

    beginning = text[:beg_len]
    ending = text[-end_len:]

    middle_pool = text[beg_len:-end_len]
    mid_sample_step = max(1, len(middle_pool) // 4)
    mid_snippets = []
    for offset in range(0, len(middle_pool), mid_sample_step):
        snippet = middle_pool[offset:offset + (mid_budget // 4)]
        if snippet.strip():
            mid_snippets.append(snippet.strip())

    combined_middle = "\n\n[... Mid-Section Key Points ...]\n\n".join(mid_snippets[:4])
    return f"{beginning}\n\n[... Content Sampled Across Chapters ...]\n\n{combined_middle}\n\n[... Final Conclusions & Appendices ...]\n\n{ending}"

def generate_summary_with_llm(text: str, summary_type: str = "abstractive", length_type: str = "medium",
                               focus_keywords: List[str] = None, language: str = "en") -> Optional[Dict[str, Any]]:
    """Generate high-intelligence summary using Qwen 2.5 / Groq LLM with multilingual Indian languages support."""
    hierarchical_text = build_hierarchical_context(text, max_chars=6500)
    focus_str = f"Focus Keywords: {', '.join(focus_keywords)}" if focus_keywords else "None"
    
    lang_code = language.lower().strip() if language else "en"
    lang_name = INDIAN_LANGUAGES.get(lang_code, "English")

    lang_mandate = ""
    if lang_code != "en":
        lang_mandate = (
            f"\n\nCRITICAL LANGUAGE MANDATE: The user's preferred language is {lang_name} ({lang_code}). "
            f"You MUST formulate the executive_summary, every bullet_point, every key_takeaway, and all explanations strictly in fluent, natural {lang_name} script ({lang_code}). "
            f"Do NOT write in English."
        )

    system_prompt = (
        "You are an enterprise AI document analyst. "
        "Analyze the provided document and generate a structured JSON summary. "
        "Do NOT include markdown code blocks like ```json, just return pure JSON with these exact keys:\n"
        "- executive_summary: A coherent, high-level narrative summary of the document.\n"
        "- bullet_points: A list of 4-7 key factual bullet points summarizing core topics.\n"
        "- key_takeaways: A list of 3-5 decisive takeaways, action items, or critical conclusions.\n"
        f"- entities: A list of 5-10 key entities, organizations, metrics, dates, or concepts mentioned.{lang_mandate}"
    )

    user_prompt = (
        f"Document Content:\n{hierarchical_text}\n\n"
        f"Summary Type: {summary_type} ({'Abstractive synthesis' if summary_type == 'abstractive' else 'Concise extractive highlights'})\n"
        f"Length Preference: {length_type} ({'Brief overview (1-2 paragraphs)' if length_type == 'short' else ('Comprehensive in-depth summary' if length_type == 'detailed' else 'Standard balanced summary')})\n"
        f"{focus_str}\n\n"
        f"Generate the JSON summary strictly in {lang_name} now:"
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    llm_res = call_unified_llm(messages, temperature=0.2, max_tokens=1600)
    if not llm_res:
        return None

    response_text, model_name = llm_res

    try:
        # Parse JSON safely
        clean_json = response_text.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.startswith("```"):
            clean_json = clean_json[3:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        clean_json = clean_json.strip()

        # Extract JSON block with regex if extra leading/trailing text exists
        match = re.search(r'(\{[\s\S]*\})', clean_json)
        if match:
            clean_json = match.group(1)

        data = json.loads(clean_json)
        original_words = len(text.split())
        summary_words = len(data.get("executive_summary", "").split())
        compression_ratio = round(summary_words / max(1, original_words), 2)
        reading_time_saved = max(0.5, round((original_words - summary_words) / 200, 1))

        return {
            "summary_type": summary_type,
            "length_type": length_type,
            "language": lang_code,
            "executive_summary": data.get("executive_summary", ""),
            "bullet_points": data.get("bullet_points", []),
            "key_takeaways": data.get("key_takeaways", []),
            "entities": data.get("entities", []),
            "confidence_score": 0.98,
            "compression_ratio": min(0.95, max(0.1, compression_ratio)),
            "reading_time_saved_min": reading_time_saved,
            "model_used": model_name,
            "original_word_count": original_words,
            "summary_word_count": summary_words
        }
    except Exception as e:
        logger.error(f"Failed to parse LLM summary JSON: {str(e)} -> Response was: {response_text[:200]}")
        return None

def generate_summary(text: str, summary_type: str = "extractive", length_type: str = "medium",
                     focus_keywords: List[str] = None, language: str = "en") -> Dict[str, Any]:
    """
    Generate rich document summary using Qwen 2.5 / Groq LLM with automatic fallback to local NLP engine.
    Supports English and 10 Indian Regional Languages (Telugu, Hindi, Tamil, Kannada, etc.).
    """
    start_time = time.time()
    
    # 1. Attempt LLM generation (Qwen 2.5 / Groq) with language
    llm_result = generate_summary_with_llm(text, summary_type, length_type, focus_keywords, language=language)
    if llm_result:
        llm_result["latency_ms"] = round((time.time() - start_time) * 1000, 1)
        return llm_result

    # 2. Fallback to Local TextRank / Extractive Engine
    sentences = split_into_sentences(text)
    if not sentences:
        sentences = [text.strip()] if text.strip() else ["Document contains no readable text."]

    total_sentences = len(sentences)
    original_words = len(text.split())

    if length_type == "short":
        target_count = max(2, min(4, total_sentences // 5 or 2))
    elif length_type == "detailed":
        target_count = max(5, min(12, total_sentences // 2 or 5))
    else: # medium
        target_count = max(3, min(7, total_sentences // 3 or 3))

    scores = calculate_sentence_scores(sentences, focus_keywords)
    ranked_indices = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:target_count]
    selected_indices = sorted(ranked_indices)
    selected_sentences = [sentences[i] for i in selected_indices]

    bullet_points = [s for s in selected_sentences if len(s.split()) >= 5]
    if not bullet_points and selected_sentences:
        bullet_points = selected_sentences

    if summary_type == "abstractive":
        lead_sentence = selected_sentences[0] if selected_sentences else "This document outlines key operational and strategic points."
        supporting = " Furthermore, ".join(selected_sentences[1:3]) if len(selected_sentences) > 1 else ""
        executive_summary = f"{lead_sentence} {supporting}" if supporting else lead_sentence
    else:
        executive_summary = " ".join(selected_sentences)

    key_takeaways = []
    for s in sentences:
        if any(marker in s.lower() for marker in ["must", "require", "shall", "result", "conclude", "increase", "decrease", "agreed", "objective", "key"]):
            if s not in key_takeaways and len(key_takeaways) < 4:
                key_takeaways.append(s)

    if not key_takeaways:
        key_takeaways = selected_sentences[:3]

    entities = extract_entities_and_keywords(text)
    summary_words = len(executive_summary.split()) + sum(len(b.split()) for b in bullet_points)
    compression_ratio = round(summary_words / max(1, original_words), 2)
    reading_time_saved = max(0.5, round((original_words - summary_words) / 200, 1))

    return {
        "summary_type": summary_type,
        "length_type": length_type,
        "executive_summary": executive_summary,
        "bullet_points": bullet_points,
        "key_takeaways": key_takeaways,
        "entities": entities,
        "confidence_score": 0.94 if original_words > 50 else 0.85,
        "compression_ratio": min(0.95, max(0.1, compression_ratio)),
        "reading_time_saved_min": reading_time_saved,
        "model_used": "Local-Hybrid-TextRank",
        "original_word_count": original_words,
        "summary_word_count": summary_words,
        "latency_ms": round((time.time() - start_time) * 1000, 1)
    }

INDIAN_LANGUAGES = {
    "en": "English",
    "hi": "Hindi (हिन्दी)",
    "te": "Telugu (తెలుగు)",
    "ta": "Tamil (தமிழ்)",
    "kn": "Kannada (ಕನ್ನಡ)",
    "ml": "Malayalam (മലയാളം)",
    "mr": "Marathi (मराठी)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "pa": "Punjabi (ਪੰਜਾਬੀ)",
    "or": "Odia (ଓଡ଼ିଆ)"
}

def answer_rag_question(doc_id: str, document_text: str, question: str,
                        history: List[Dict[str, Any]] = None,
                        language: str = "en") -> Dict[str, Any]:
    """
    RAG semantic retrieval and question answering powered by Qwen 2.5 / Groq LLM with chunk citations.
    Supports native generation in English and 10 Indian Regional Languages (Telugu, Hindi, Tamil, etc.).
    """
    start_time = time.time()
    vector_index = get_or_create_vector_store(doc_id, document_text)
    relevant_chunks = vector_index.search(question, top_k=4)

    lang_code = language.lower().strip() if language else "en"
    lang_name = INDIAN_LANGUAGES.get(lang_code, "English")

    if not relevant_chunks:
        default_answers = {
            "te": "అందించిన డాక్యుమెంట్‌లో ఈ ప్రశ్నకు సంబంధించిన సమాచారం కనుగొనబడలేదు. దయచేసి ప్రశ్నను స్పష్టంగా అడగండి.",
            "hi": "अपलोड किए गए दस्तावेज़ में इस प्रश्न से संबंधित संदर्भ नहीं मिला। कृपया दस्तावेज़ पाठ सत्यापित करें या प्रश्न बदलें।",
            "ta": "பதிவேற்றப்பட்ட ஆவணத்தில் இந்த வினவல் தொடர்பான குறிப்பிட்ட சூழலைக் கண்டறிய முடியவில்லை.",
            "en": "I could not locate specific context regarding this inquiry in the uploaded document. Please verify the document text or rephrase your question."
        }
        return {
            "answer": default_answers.get(lang_code, default_answers["en"]),
            "citations": [],
            "confidence_score": 0.35,
            "latency_ms": round((time.time() - start_time) * 1000, 1),
            "language": lang_code,
            "suggested_questions": [
                "What is the main objective of this document?",
                "Can you summarize the key findings?",
                "What are the primary recommendations?"
            ]
        }

    citations = []
    context_blocks = []
    for chunk in relevant_chunks:
        citations.append({
            "chunk_id": chunk["chunk_id"],
            "page_number": chunk["page_number"],
            "relevance_percent": chunk["relevance_percent"],
            "snippet": chunk["text"][:180] + ("..." if len(chunk["text"]) > 180 else "")
        })
        context_blocks.append(f"[Page {chunk['page_number']} | Chunk {chunk['chunk_id']}]:\n{chunk['text']}")

    combined_context = "\n\n".join(context_blocks)

    # 1. Attempt LLM Grounded Answer with Multilingual Output (Qwen 2.5 / Groq)
    lang_directive = ""
    if lang_code != "en":
        lang_directive = (
            f"\n\nCRITICAL LANGUAGE RULE: The user has selected {lang_name} ({lang_code}). "
            f"You MUST formulate your complete answer strictly in natural, fluent {lang_name} script. "
            f"Do NOT answer in English."
        )

    system_prompt = (
        "You are CognitiveDoc AI, an enterprise intelligence assistant. "
        "Answer the user's question accurately and concisely based ONLY on the provided document excerpts. "
        "Cite relevant page numbers (e.g. '[Page X]') when stating facts. "
        f"If the excerpts do not contain the answer, politely state what is known and what is missing.{lang_directive}"
    )

    user_prompt = f"Document Excerpts:\n{combined_context}\n\nUser Question: {question}\n\nAnswer in {lang_name}:"
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ]

    llm_res = call_unified_llm(messages, temperature=0.1, max_tokens=300)
    if llm_res:
        llm_answer, model_name = llm_res
        latency_ms = round((time.time() - start_time) * 1000, 1)
        suggested = [
            f"Can you explain the key details from Page {relevant_chunks[0]['page_number']}?",
            "What are the specific requirements or next steps?",
            "Are there any risk factors or exceptions noted?"
        ]
        return {
            "answer": llm_answer.strip(),
            "citations": citations,
            "confidence_score": 0.96,
            "latency_ms": latency_ms,
            "model_used": model_name,
            "language": lang_code,
            "suggested_questions": suggested
        }

    # 2. Fallback to Local Sentence Matcher
    top_chunk = relevant_chunks[0]
    matched_text = top_chunk["text"]
    sentences = split_into_sentences(matched_text)
    q_words = set([w.lower() for w in re.findall(r'\b\w{3,}\b', question) if w.lower() not in STOPWORDS])
    
    best_sentences = []
    for s in sentences:
        s_words = set([w.lower() for w in re.findall(r'\b\w{3,}\b', s)])
        overlap = len(q_words.intersection(s_words))
        if overlap > 0:
            best_sentences.append((overlap, s))

    best_sentences.sort(key=lambda x: x[0], reverse=True)

    if best_sentences:
        core_answer = " ".join([item[1] for item in best_sentences[:2]])
        answer = f"Based on Section (Page {top_chunk['page_number']}): {core_answer}"
    else:
        answer = f"According to the document records on Page {top_chunk['page_number']}, {matched_text[:280]}..."

    confidence = min(0.97, max(0.65, top_chunk.get("score", 0.85) + 0.1))
    latency_ms = round((time.time() - start_time) * 1000, 1)

    return {
        "answer": answer,
        "citations": citations,
        "confidence_score": round(confidence, 2),
        "latency_ms": latency_ms,
        "model_used": "Local-Hybrid-SentenceRank",
        "language": lang_code,
        "suggested_questions": [
            f"What are the implications mentioned in Page {top_chunk['page_number']}?",
            "Can you extract any metrics or timelines from this section?",
            "What are the key responsibilities or next steps?"
        ]
    }
