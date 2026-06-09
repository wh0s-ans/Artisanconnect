import logging

logger = logging.getLogger(__name__)

async def send_push_notification(token: str, title: str, body: str, data: dict = None):
    """
    Mock FCM implementation.
    Logs the push notification in development.
    """
    if not token:
        logger.warning("Attempted to send push notification without a token.")
        return False
        
    logger.info(f"Mock FCM - Sending Push Notification to {token}")
    logger.info(f"Title: {title}")
    logger.info(f"Body: {body}")
    if data:
        logger.info(f"Data: {data}")
        
    return True
