-- Update notification_settings table to support Telegram instead of WhatsApp
ALTER TABLE public.notification_settings 
RENAME COLUMN whatsapp_webhook_url TO telegram_bot_token;

-- Add Telegram chat ID column for notifications
ALTER TABLE public.notification_settings 
ADD COLUMN telegram_chat_ids TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Update existing data to use new column structure
UPDATE public.notification_settings 
SET telegram_chat_ids = notification_recipients 
WHERE notification_recipients IS NOT NULL;

-- Update the column comment for clarity
COMMENT ON COLUMN public.notification_settings.telegram_bot_token IS 'Telegram Bot API token for sending notifications';
COMMENT ON COLUMN public.notification_settings.telegram_chat_ids IS 'Array of Telegram chat IDs to receive notifications';