import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformer_model import build_transformer
from summarization import summarize
from transformers import T5Tokenizer, T5ForConditionalGeneration

app = Flask(__name__)
CORS(app)

MODEL_CONFIG = {
    "src_vocab_size": 30522,
    "tgt_vocab_size": 30522,
    "src_seq_len": 512,
    "tgt_seq_len": 512,
    "d_model": 512,
    "N": 6,
    "h": 8,
    "dropout": 0.1,
    "d_ff": 2048
}

def initialize_transformer_model():
    model = build_transformer(**MODEL_CONFIG)
    model.load_state_dict(torch.load(
        r"C:\Users\RAMA\Downloads\transformer_model_weights_epoch_6_loss_3.3377.pth",
        map_location='cpu', weights_only=True
    ))
    model.eval()
    return model

def initialize_qa_model():
    """Initialize the T5 question answering model"""
    try:
        model_path = r"C:\Users\RAMA\Downloads\epoch_10.pt"
        tokenizer_path = r"C:\Users\RAMA\Downloads\talqs\project\project\backend\t5_scratch_trained_tokenizer2"
        
        # Check if your trained model exists
        if os.path.exists(model_path) and os.path.exists(tokenizer_path):
            print("Loading your trained T5 model...")
            tokenizer = T5Tokenizer.from_pretrained(tokenizer_path)
            model = T5ForConditionalGeneration.from_pretrained(model_path)
        else:
            # Option 2: Use pre-trained T5-small as fallback
            print("Trained model not found, using pre-trained T5-small...")
            tokenizer = T5Tokenizer.from_pretrained("t5-small")
            model = T5ForConditionalGeneration.from_pretrained("t5-small")
        
        model.eval()
        return model, tokenizer
        
    except Exception as e:
        print(f"❌ QA Model loading failed: {str(e)}")
        print("Attempting to load pre-trained T5-small as fallback...")
        try:
            # Fallback to pre-trained T5-small
            tokenizer = T5Tokenizer.from_pretrained("t5-small")
            model = T5ForConditionalGeneration.from_pretrained("t5-small")
            model.eval()
            print("✅ Loaded pre-trained T5-small successfully")
            return model, tokenizer
        except Exception as fallback_error:
            print(f"❌ Fallback loading also failed: {str(fallback_error)}")
            return None, None

def generate_answer(model, tokenizer, question, context, device='cpu'):
    """Generate answer using the T5 model"""
    model.eval()
    
    # For T5, we need to format the input properly
    input_text = f"question: {question} context: {context}"
    
    # Truncate context if too long to fit within token limits
    max_context_length = 400  # Leave room for question and special tokens
    if len(context.split()) > max_context_length:
        context_words = context.split()[:max_context_length]
        context = " ".join(context_words)
        input_text = f"question: {question} context: {context}"

    inputs = tokenizer(
        input_text, 
        return_tensors="pt", 
        truncation=True, 
        padding="max_length", 
        max_length=512
    ).to(device)

    with torch.no_grad():
        generated_ids = model.generate(
            input_ids=inputs['input_ids'],
            attention_mask=inputs['attention_mask'],
            max_length=128,
            num_beams=4,
            early_stopping=True,
            do_sample=False  # For more deterministic results
        )

    output = tokenizer.decode(generated_ids[0], skip_special_tokens=True)
    return output

# Initialize models
try:
    transformer_model = initialize_transformer_model()
    print("✅ Transformer model loaded successfully")
except Exception as e:
    print(f"❌ Transformer model loading failed: {str(e)}")
    transformer_model = None

try:
    qa_model, qa_tokenizer = initialize_qa_model()
    if qa_model and qa_tokenizer:
        print("✅ QA model loaded successfully")
    else:
        print("❌ QA model loading failed")
except Exception as e:
    print(f"❌ QA model initialization failed: {str(e)}")
    qa_model, qa_tokenizer = None, None

@app.route('/')
def health_check():
    return jsonify({
        "status": "Operational",
        "transformer_model_loaded": bool(transformer_model),
        "qa_model_loaded": bool(qa_model and qa_tokenizer)
    }), 200

@app.route('/summarize', methods=['POST'])
def summarize_text():
    if not transformer_model:
        return jsonify({"error": "Summarization model not available"}), 503
    
    data = request.get_json()
    text = data.get('text', '')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    try:
        summary = summarize(transformer_model, text)
        return jsonify({'summary': summary})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/ask', methods=['POST'])
def ask_question():
    """Endpoint that matches your React component's API call"""
    if not qa_model or not qa_tokenizer:
        return jsonify({"error": "Question answering model not available"}), 503
    
    data = request.get_json()
    question = data.get('question', '')
    text = data.get('text', '')  # This is the document content from React
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    if not text:
        return jsonify({'error': 'No document text provided'}), 400
    
    try:
        # Determine device
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
        # Move model to device if needed
        if device == 'cuda' and qa_model.device.type != 'cuda':
            qa_model.to(device)
        
        # Generate answer using the document text as context
        answer = generate_answer(qa_model, qa_tokenizer, question, text, device)
        
        # Extract relevant context (first 500 chars of the document)
        context_preview = text[:500] + "..." if len(text) > 500 else text
        
        return jsonify({
            'question': question,
            'answer': answer,
            'context': context_preview
        })
    
    except Exception as e:
        return jsonify({'error': f'Question answering failed: {str(e)}'}), 500

@app.route('/answer', methods=['POST'])
def answer_question():
    """Alternative endpoint for question answering with separate context"""
    if not qa_model or not qa_tokenizer:
        return jsonify({"error": "Question answering model not available"}), 503
    
    data = request.get_json()
    question = data.get('question', '')
    context = data.get('context', '')
    
    if not question:
        return jsonify({'error': 'No question provided'}), 400
    
    if not context:
        return jsonify({'error': 'No context provided'}), 400
    
    try:
        # Determine device
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        
        # Generate answer
        answer = generate_answer(qa_model, qa_tokenizer, question, context, device)
        
        return jsonify({
            'question': question,
            'context': context[:200] + "..." if len(context) > 200 else context,
            'answer': answer
        })
    
    except Exception as e:
        return jsonify({'error': f'Question answering failed: {str(e)}'}), 500

@app.route('/qa-batch', methods=['POST'])
def answer_questions_batch():
    """Endpoint for answering multiple questions"""
    if not qa_model or not qa_tokenizer:
        return jsonify({"error": "Question answering model not available"}), 503
    
    data = request.get_json()
    questions = data.get('questions', [])
    context = data.get('context', '')
    
    if not questions:
        return jsonify({'error': 'No questions provided'}), 400
    
    if not context:
        return jsonify({'error': 'No context provided'}), 400
    
    try:
        device = 'cuda' if torch.cuda.is_available() else 'cpu'
        results = []
        
        for question in questions:
            answer = generate_answer(qa_model, qa_tokenizer, question, context, device)
            results.append({
                'question': question,
                'answer': answer
            })
        
        return jsonify({
            'context': context[:200] + "..." if len(context) > 200 else context,
            'results': results
        })
    
    except Exception as e:
        return jsonify({'error': f'Batch question answering failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
