import logging
import uuid
import os

logger = logging.getLogger(__name__)

async def upload_file(file_content: bytes, filename: str) -> str:
    """
    Mock Storage implementation.
    In a real app, this would upload to S3 or Google Cloud Storage.
    """
    ext = os.path.splitext(filename)[1]
    mock_url = f"https://storage.artisanconnect.app/mock/{uuid.uuid4()}{ext}"
    logger.info(f"Mock Storage - Uploaded file {filename} to {mock_url}")
    
    return mock_url
