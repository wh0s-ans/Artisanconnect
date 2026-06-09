import logging

logger = logging.getLogger(__name__)

async def send_email(to_email: str, subject: str, content: str):
    """
    Mock Email implementation.
    """
    logger.info(f"Mock Email - Sending to {to_email}")
    logger.info(f"Subject: {subject}")
    logger.info(f"Content: {content}")
    
    return True
