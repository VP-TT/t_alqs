# summarization.py
import torch
from transformers import AutoTokenizer
import math

# Import your model
from transformer_model import build_transformer

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained("law-ai/InLegalBERT")

def chunk_text(text, max_tokens, tokenizer):
    """Split text into chunks that fit within max_tokens."""
    # Tokenize the full text
    tokens = tokenizer.encode(text, add_special_tokens=True)
    num_tokens = len(tokens)

    # Calculate number of chunks
    num_chunks = math.ceil(num_tokens / max_tokens)
    chunk_size = math.ceil(num_tokens / num_chunks)  # Tokens per chunk

    # Split into chunks
    chunks = []
    for i in range(0, num_tokens, chunk_size):
        chunk_tokens = tokens[i:i + chunk_size]
        chunk_text = tokenizer.decode(chunk_tokens, skip_special_tokens=True)
        chunks.append(chunk_text)
    return chunks

def summarize(model, text, max_length=512):
    """Generate a summary for the given text using the trained model."""
    device = next(model.parameters()).device
    
    # Tokenize input
    input_ids = tokenizer.encode(text, return_tensors="pt", max_length=max_length, 
                                truncation=True, padding="max_length")
    input_ids = input_ids.to(device)
    
    # Create source mask (1 for non-padding tokens)
    src_mask = (input_ids != tokenizer.pad_token_id).unsqueeze(1).unsqueeze(2)
    src_mask = src_mask.to(device)
    
    # Start with BOS token
    start_token = tokenizer.cls_token_id
    decoder_input = torch.tensor([[start_token]], device=device)
    
    # Encode the source
    encoder_output = model.encode(input_ids, src_mask)
    
    # Generate output tokens one by one
    output_sequence = [start_token]
    max_output_length = 100  # Adjust as needed
    
    with torch.no_grad():
        for _ in range(max_output_length):
            # Create target mask (to prevent looking ahead)
            tgt_mask = torch.ones(1, len(output_sequence), len(output_sequence), device=device)
            tgt_mask = torch.tril(tgt_mask)  # Lower triangular mask
            
            # Convert output sequence to tensor
            decoder_input = torch.tensor([output_sequence], device=device)
            
            # Decode and project
            decoder_output = model.decode(encoder_output, src_mask, decoder_input, tgt_mask)
            projection = model.project(decoder_output)
            
            # Get the next token (last position)
            next_token_logits = projection[:, -1, :]
            next_token = torch.argmax(next_token_logits, dim=-1).item()
            
            # Add to output sequence
            output_sequence.append(next_token)
            
            # Stop if we predict EOS
            if next_token == tokenizer.sep_token_id:
                break
    
    # Decode the output tokens
    summary = tokenizer.decode(output_sequence, skip_special_tokens=True)
    return summary
