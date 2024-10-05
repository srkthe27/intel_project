from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch
import os
from .models import CustomUser,QuizResult
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework.response import Response
import json
from rest_framework import status
from django.views.decorators.csrf import csrf_exempt
from diffusers import DiffusionPipeline
from pymongo import MongoClient
import re
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB URI
db = client["toys_games"]  # Replace with your database name
collection = db["static_questions"]  # Replace with your collection name
# Set up device for inference
os.environ["CUDA_VISIBLE_DEVICES"] = "0"
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(DEVICE," : ",torch.cuda.get_device_name(DEVICE))
if DEVICE == "cuda":
    print(DEVICE, ":", torch.cuda.get_device_name(0))
else:
    print(DEVICE)
# Define the model path
#model_name_or_path = "Sreenington/Llama-3-8B-ChatQA-AWQ"
model_name_or_path = "TheBloke/Mistral-7B-Instruct-v0.2-AWQ"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_name_or_path)
model = AutoModelForCausalLM.from_pretrained(model_name_or_path, torch_dtype=torch.float16, low_cpu_mem_usage=True).to("cuda") # device_map="auto" if DEVICE == "cuda" else None)
# Create a text generation pipeline
text_gen_pipeline = pipeline("text-generation", model=model, tokenizer=tokenizer)
# Assuming you have already loaded the tokenizer
tokenizer.pad_token = tokenizer.eos_token  # Set padding token to EOS token
# Assuming you have already loaded the tokenizer
if tokenizer.pad_token is None:
    tokenizer.add_special_tokens({'pad_token': '[PAD]'}) # Add a new pad token

# Initialize memory to store conversation history
memory = []
torch.cuda.empty_cache()
pipe = DiffusionPipeline.from_pretrained("kopyl/nano-sd-tuned-sample")
pipe.to("cpu")  # Move to CPU as per your setup

@csrf_exempt
@api_view(['POST'])
def generate_avatar(request):
    try:
        # Extract the prompt from the request body
        data = json.loads(request.body)
        prompt = data.get('prompt')

        if not prompt:
            return JsonResponse({"error": "Prompt is required."}, status=400)

        # Generate the image
        image = pipe(prompt).images[0]

        # Define the path to save the generated image
        image_path = f"static/generated_avatars/{prompt.replace(' ', '_')}.png"
        image.save(image_path)

        # Return the path to the generated image
        return JsonResponse({"image_url": image_path}, status=200)

    except Exception as e:
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)

def generate_scenario(career_name, level):
    try:
        # Normalize career name to lowercase to avoid case-sensitivity issues
        career_name = career_name.lower()

        # Create a prompt asking the model to generate a scenario
        prompt = f"Generate an engaging scenario for a child in the field of {career_name} at level {level}. The scenario should include a title, a description, a problem, and three to four multiple-choice options for the child to select. Also, specify which option is correct and describe how it helps the child progress to the next level.:"

        # Tokenize the prompt
        inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)

        # Generate the scenario using the model
        outputs = model.generate(
            inputs["input_ids"].to("cuda"),  # Move input ids to the device
            attention_mask=inputs["attention_mask"].to("cuda"),  # Include the attention mask
            max_length=500,  # Adjust the max_length as needed
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.9,
            do_sample=True
        )

        # Decode and return the generated text
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return generated_text.strip()

    except Exception as e:
        # Log the error for better debugging
        print(f"Error generating scenario: {e}")
        return "An error occurred while generating the scenario."

   



@api_view(['POST'])
def generate_scenario_api(request):
    try:
        career_name = request.data.get('career_name')
        level = request.data.get('level')

        print(f"Career: {career_name}, Level: {level}")

        if not career_name or not level:
            return Response({'error': 'Career name and level are required.'}, status=status.HTTP_400_BAD_REQUEST)

        scenario = generate_scenario(career_name, level)
        return Response({'scenario': scenario}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': 'An unexpected error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def generate_story_api(request):
    data = json.loads(request.body)
    career_name = data.get('career_name')
    level = int(data.get('level'))
    age=8

    # Use a custom prompt based on the career and level
    prompt = f"Create a story where a child aged {age} helps in a {career_name} scenario at level {level}."
    response = text_gen_pipeline(prompt, max_length=200, num_return_sequences=1)
    story = response[0]['generated_text']
    
    return JsonResponse({"story": story})

def generate_questions(stars):
    if stars == 1:
        difficulty = "easy"
    elif stars == 2:
        difficulty = "medium"
    else:
        difficulty = "hard"

    # Define the prompt
    prompt = (
        f"Generate 5 {difficulty} level multiple-choice questions for a child about engineering. "
        "Each question should have 4 answer choices labeled A, B, C, and D, and indicate the correct answer."
    )

    # Tokenize the input prompt
    inputs = tokenizer(prompt, return_tensors="pt", padding=False, truncation=True).to("cuda")

    # Generate questions
    attention_mask = torch.ones_like(inputs["input_ids"])
    attention_mask[inputs["input_ids"] == tokenizer.pad_token_id] = 0
    outputs = model.generate(
        inputs["input_ids"],
        attention_mask=attention_mask,
        max_length=500,
        num_return_sequences=1,
        temperature=0.7,
        top_p=0.9,
        do_sample=True
    )

    # Decode and format questions
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    questions = generated_text.split("Q")[1:]  # Split on 'Q' and skip the first (empty) element
    formatted_questions = [f"Q{question.strip()}" for question in questions if question.strip()]

    return formatted_questions[:5]
@api_view(['POST'])
def generate_content(request):
    try:
        data = json.loads(request.body)
        age = data.get('age', 10)  # Default to age 10 if not provided

        # Validate the age input
        if not isinstance(age, int) or age < 6 or age > 17:
            return JsonResponse({'error': 'Age must be an integer between 6 and 17.'}, status=400)

        # Define the prompt based on age
        prompt = f"Explain engineering to a {age}-year-old child in an interactive and engaging way."

        # Generate content using the model
        inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)
        input_ids = inputs.input_ids.to('cuda' if torch.cuda.is_available() else 'cpu')
        attention_mask = inputs.attention_mask.to('cuda' if torch.cuda.is_available() else 'cpu')  # Set attention mask

        # Ensure to pass attention_mask to the model.generate call
        outputs = model.generate(input_ids, attention_mask=attention_mask, max_length=200, num_return_sequences=1)

        # Decode and send response
        generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
        return JsonResponse({'content': generated_text}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    except ValueError:
        return JsonResponse({'error': 'Invalid age input. Age must be an integer.'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@api_view(['POST'])
def generate_quiz_api(request):
    try:
        print("Received request for quiz generation")  # Debugging log
        data = json.loads(request.body)
        stars = int(data.get('stars'))

        # Validate the stars parameter
        if not (1 <= stars <= 3):
            return JsonResponse({"error": "Stars must be between 1 and 3."}, status=400)

        print(f"Generating questions for {stars} stars")  # Debugging log
        questions = generate_questions(stars)
        return JsonResponse({"questions": questions}, status=200)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON format."}, status=400)

    except Exception as e:
        print(f"Error in generate_quiz_api: {e}")  # Log the error message
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)
# Generalized function to handle career guidance for various fields
# Fetch data from MongoDB
def fetch_career_data():
    career_data = []
    cursor = collection.find({}, {"question": 1, "answer": 1, "_id": 0})  # Fetch only the required fields
    for document in cursor:
        career_data.append(document)
    return career_data

career_data = fetch_career_data()

# Define a function to extract keywords from the prompt
def extract_keywords(prompt):
    prompt = prompt.lower()
    keywords = []
    for data in career_data:
        if re.search(rf'\b{data["question"]}\b', prompt):
            keywords.append(data["question"])
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

# Define a function to generate a response using the pre-trained model
def generate_response_with_model(prompt):
    inputs = tokenizer(prompt, return_tensors="pt", padding=True, truncation=True)

    
    for k, v in inputs.items():
        inputs[k] = v.to("cuda")


    outputs = model.generate(
        inputs['input_ids'], 
        attention_mask=inputs['attention_mask'],
        max_length=150, 
        pad_token_id=tokenizer.eos_token_id,
        no_repeat_ngram_size=2,
        do_sample=True,
        temperature=0.5,
        top_p=0.8,
    ).to("cuda")

    response = tokenizer.decode(outputs[0], skip_special_tokens=True, clean_up_tokenization_spaces=True)
    return response

@csrf_exempt  # Disable CSRF validation for this endpoint
def career_guidance_chatbot(request):
    if request.method == "POST":
        data = json.loads(request.body)  # Get JSON data from request
        user_prompt = data.get("prompt", "")

        # Extract keywords from the user prompt
        keywords = extract_keywords(user_prompt)
        
        if keywords:
            
            response = generate_answer(keywords)

        
        model_response = generate_response_with_model(user_prompt)

        #
        return JsonResponse({
            "generated_career_response": response,
            "model_response": model_response,
        })

    return JsonResponse({"error": "Invalid request method."}, status=400)
def format_text_with_linebreaks(text):
    return text.replace('. ', '.\n').replace('! ', '!\n').replace('? ', '?\n')

# Store memory (optional feature, if needed)
def store_in_memory(user_input, bot_response):
    memory.append({
        "user_input": user_input,
        "bot_response": bot_response
    })

# API view to handle career guidance requests

# Placeholder for sign-up, sign-in, and quiz submission functionality
#def submit_quiz(request):
#    return JsonResponse({"message": "Quiz submission not implemented yet."}, status=501)

CustomUser = get_user_model()
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def sign_up(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data.get('email')
        name = data.get('name')
        age_str = data.get('age')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')

        # Debugging: Print incoming data
        print(f"Received data: {data}")

        if password != confirm_password:
            return JsonResponse({"error": "Passwords do not match."}, status=400)

        try:
            age = int(age_str)
        except ValueError:
            return JsonResponse({"error": "Invalid age format."}, status=400)

        if not (6 <= age <= 17):
            return JsonResponse({"error": "Age must be between 6 and 17."}, status=400)

        # Create user
        try:
            user = CustomUser(
                email=email,
                name=name,
                age=age
            )
            user.set_password(password)  # Set the password
            user.save()  # Save the user instance to the database
            return JsonResponse({"message": "User created successfully."}, status=201)
        except Exception as e:
            # Print detailed error message for debugging
            print(f"Error creating user: {str(e)}")
            return JsonResponse({"error": "User creation failed. " + str(e)}, status=400)

    return JsonResponse({"message": "Sign-up functionality not implemented yet."}, status=501)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def sign_in(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        email = data.get('email')
        password = data.get('password')

        print(f"Sign-in data: {data}")  # Debugging: Print incoming data

        if not email or not password:
            return JsonResponse({"error": "Email and password are required."}, status=400)

        try:
            # Fetch the user based on email
            user_model = get_user_model()
            try:
                user = user_model.objects.get(email=email)
            except user_model.DoesNotExist:
                return JsonResponse({"error": "Invalid email or password."}, status=400)

            #print(f"User found: {user.email}")  # Debugging: Print user email

            # Ensure user instance has a primary key before checking password
            if user.pk is None:
                return JsonResponse({"error": "User instance has no primary key."}, status=400)

            # Check the password
            if user.check_password(password):
                # Password is correct, return success response
                return JsonResponse({"message": "Sign-in successful."}, status=200)
            else:
                print("Password check failed.")  # Debugging
                return JsonResponse({"error": "Invalid email or password."}, status=400)

        except Exception as e:
            print(f"An unexpected error occurred: {str(e)}")  # Debugging
            return JsonResponse({"error": "An unexpected error occurred."}, status=500)

    return JsonResponse({"message": "Method not allowed."}, status=405)

CustomUser = get_user_model()
@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])  # No need for authentication for testing
def submit_quiz(request):
    try:
        # Parse the request data
        data = request.data
        score = data.get('score')
        stars_earned = data.get('starsEarned')
        total_questions = data.get('total_questions')
        
        if score is None or stars_earned is None:
            return JsonResponse({"error": "Missing score or starsEarned"}, status=400)

        # Get the authenticated user (assuming you have user authentication)
        user = CustomUser.objects.get(id=1)  # Use authenticated user in real app

        # Calculate XP (Example: 10 XP per score point)
        xp_earned = score * 10

        # Update the user's XP
        user.xp += xp_earned
        user.save()

        # Store quiz result in MongoDB
        QuizResult.objects.create(
            user=user,
            score=score,
            stars_earned=stars_earned,
            total_questions=total_questions,
        )

        return JsonResponse({
            "message": "Quiz submitted successfully",
            "XP": xp_earned,
            "total_XP": user.xp  # Return the total XP
        })

    except Exception as e:
        print(f"Error in submit_quiz: {e}")  # Log the error for debugging
        return JsonResponse({"error": "Internal server error"}, status=500)    
