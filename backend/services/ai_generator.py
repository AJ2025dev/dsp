import os
from openai import OpenAI

def generate_creative_text(product: str, audience: str, model: str = "openai") -> str:
    if model.lower() == "openai":
        key = os.getenv("OPENAI_API_KEY")
        if not key:
            return f"(OpenAI stub) Creative for '{product}' targeting {audience}."
        client = OpenAI(api_key=key)
        resp = client.chat.completions.create(
            model=os.getenv("LLM_MODEL","gpt-4o-mini"),
            messages=[
                {"role":"system","content":"You write short, punchy, high-CTR ad copy."},
                {"role":"user","content": f"Product: {product}\nAudience: {audience}\nGive 3 headline+description pairs."}
            ],
            max_tokens=400, temperature=0.7
        )
        return resp.choices[0].message.content.strip()
    else:
        # MiniMax placeholder
        if not os.getenv("MINIMAX_API_KEY"):
            return f"(MiniMax stub) Creative for '{product}' targeting {audience}."
        return f"(MiniMax) Creative for '{product}' targeting {audience}."  # replace with real call later
