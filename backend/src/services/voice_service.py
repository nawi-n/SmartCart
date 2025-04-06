import speech_recognition as sr
import pyttsx3
from ..config import settings

class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.engine = pyttsx3.init()
        self.engine.setProperty('rate', 150)  # Speed of speech
    
    async def speech_to_text(self, audio_data: bytes) -> str:
        try:
            # Convert bytes to audio data
            audio = sr.AudioData(audio_data, sample_rate=44100, sample_width=2)
            
            # Recognize speech
            text = self.recognizer.recognize_google(
                audio,
                language=settings.SPEECH_RECOGNITION_LANGUAGE
            )
            
            return text
        
        except sr.UnknownValueError:
            return "Sorry, I couldn't understand the audio."
        
        except sr.RequestError as e:
            return f"Sorry, there was an error with the speech recognition service: {str(e)}"
    
    async def text_to_speech(self, text: str) -> bytes:
        try:
            # Save speech to temporary file
            self.engine.save_to_file(text, 'temp.mp3')
            self.engine.runAndWait()
            
            # Read the file and return bytes
            with open('temp.mp3', 'rb') as f:
                audio_data = f.read()
            
            return audio_data
        
        except Exception as e:
            raise Exception(f"Error converting text to speech: {str(e)}")
        
        finally:
            # Clean up temporary file
            import os
            if os.path.exists('temp.mp3'):
                os.remove('temp.mp3') 