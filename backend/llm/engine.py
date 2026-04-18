from transformers import pipeline

generator = pipeline(
    "text-generation",
    model="google/flan-t5-small",
    max_length=256
)

def generate(prompt):
    return generator(prompt, do_sample=False)[0]["generated_text"]