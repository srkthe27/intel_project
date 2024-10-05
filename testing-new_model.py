import re
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import os
from pymongo import MongoClient

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB URI
db = client["career_guidance_db"]  # Replace with your database name
collection = db["career_data"]  # Replace with your collection name

# Set the environment variable to specify the GPU
os.environ["CUDA_VISIBLE_DEVICES"] = "0"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# Print the device information
if DEVICE == "cuda":
    print(DEVICE, ":", torch.cuda.get_device_name(0))
else:
    print(DEVICE)

# Fetch data from MongoDB
def fetch_career_data():
    career_data = []
    cursor = collection.find({}, {"career": 1, "answer": 1, "_id": 0})  # Fetch only the required fields
    for document in cursor:
        career_data.append(document)
    return career_data

career_data = fetch_career_data()

# Define a function to extract keywords from the prompt
def extract_keywords(prompt):
    prompt = prompt.lower()
    keywords = []
    for data in career_data:
        if re.search(rf'\b{data["career"]}\b', prompt):
            keywords.append(data["career"])
    return keywords

# Define a function to retrieve an answer based on keywords
def generate_answer(keywords):
    answers = []
    for keyword in keywords:
        for data in career_data:
            if data["career"] == keyword:
                answers.append(data["answer"])
    if not answers:
        return "Sorry, I couldn't find information on that career."
    return " ".join(answers)

# Load the pre-trained model
model_name_or_path = "TheBloke/Mistral-7B-Instruct-v0.2-AWQ"

# Load the pre-trained model with pad_token_id set
tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
model = AutoModelForCausalLM.from_pretrained(
    model_name_or_path,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True,
    device_map="auto" if DEVICE == "cuda" else None
)

# Set pad_token_id to eos_token_id if not set
tokenizer.pad_token_id = tokenizer.eos_token_id

# Move model to GPU if available
if DEVICE == "cuda":
    model = model.to('cuda')

# Define a function to generate a response using the pre-trained model
def generate_response_with_model(prompt):
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)

    # Move inputs to GPU if available
    for k, v in inputs.items():
        inputs[k] = v.to(DEVICE)

    # Generate the response
    outputs = model.generate(
        inputs['input_ids'], 
        attention_mask=inputs['attention_mask'],
        max_length=150, 
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=2,
        do_sample=True,
        temperature=0.5,
        top_p=0.8
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)
    return response

# Example usage
user_prompt = "What specific tasks does a software developer perform in the healthcare industry?"
keywords = extract_keywords(user_prompt)  # Extract keywords from the user prompt
if keywords:
    # Generate a response using the extracted keywords
    response = generate_answer(keywords)
else:
    response = "Sorry, I couldn't identify any careers in your question."

# Generate a model-based response
model_response = generate_response_with_model(user_prompt)

# Print the responses
print("Generated Career Response:", response)
print("Model Response:", model_response)
