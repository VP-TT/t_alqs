import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
import re

class LegalQAProcessor:
    def __init__(self, model_path, tokenizer_path):
        self.model = T5ForConditionalGeneration.from_pretrained(model_path)
        self.tokenizer = T5Tokenizer.from_pretrained(tokenizer_path)
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)
        self.model.eval()
        
        self.stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'is', 'in', 'it', 'to', 'of'}

    def preprocess_context(self, full_text, question, max_sentences=5):
        question_keywords = set(re.findall(r'\b\w+\b', question.lower())) - self.stop_words
        sentences = re.split(r'(?<=[.!?])\s+', full_text)
        
        scored = []
        for idx, sent in enumerate(sentences):
            score = sum(1 for word in question_keywords if word in sent.lower())
            scored.append((sent, score, idx))
            
        scored.sort(key=lambda x: (-x[1], x[2]))
        return ' '.join([s[0] for s in scored[:max_sentences]])

    def generate_answer(self, context, question):
        input_text = f"question: {question} context: {context}"
        inputs = self.tokenizer(
            input_text, 
            return_tensors="pt", 
            truncation=True, 
            max_length=512,
            padding='max_length'
        ).to(self.device)
        
        with torch.no_grad():
            outputs = self.model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_length=150,
                num_beams=4,
                early_stopping=True
            )
            
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
