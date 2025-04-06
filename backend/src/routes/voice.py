from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..routes.auth import get_current_user
from ..services.voice_service import VoiceService
from ..schemas.voice import VoiceResponse

router = APIRouter()
voice_service = VoiceService()

@router.post("/voice/speech-to-text/", response_model=VoiceResponse)
async def speech_to_text(
    audio_file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Read audio file
        audio_data = await audio_file.read()
        
        # Convert speech to text
        text = await voice_service.speech_to_text(audio_data)
        
        return {"text": text}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/voice/text-to-speech/")
async def text_to_speech(
    text: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Convert text to speech
        audio_data = await voice_service.text_to_speech(text)
        
        return {
            "audio_data": audio_data,
            "content_type": "audio/mpeg"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        ) 