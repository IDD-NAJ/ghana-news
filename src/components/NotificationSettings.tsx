import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Plus, X } from "lucide-react";

interface NotificationSetting {
  id: string;
  telegram_bot_token: string;
  telegram_chat_ids: string[];
  notification_recipients: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const NotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSetting | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    telegram_bot_token: "",
    telegram_chat_ids: [] as string[],
    active: true
  });
  const [newRecipient, setNewRecipient] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setFormData({
        telegram_bot_token: settings.telegram_bot_token || "",
        telegram_chat_ids: settings.telegram_chat_ids || [],
        active: settings.active
      });
    }
  }, [settings]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("notification_settings")
        .select("*")
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      setSettings(data);
    } catch (error: any) {
      console.error("Error fetching notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to load notification settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const submitData = {
        telegram_bot_token: formData.telegram_bot_token || null,
        telegram_chat_ids: formData.telegram_chat_ids,
        active: formData.active
      };

      if (settings) {
        const { error } = await supabase
          .from("notification_settings")
          .update(submitData)
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("notification_settings")
          .insert([submitData]);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Notification settings saved successfully"
      });

      fetchSettings();
    } catch (error: any) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to save notification settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const addRecipient = () => {
    if (newRecipient.trim() && !formData.telegram_chat_ids.includes(newRecipient.trim())) {
      setFormData(prev => ({
        ...prev,
        telegram_chat_ids: [...prev.telegram_chat_ids, newRecipient.trim()]
      }));
      setNewRecipient("");
    }
  };

  const removeRecipient = (recipient: string) => {
    setFormData(prev => ({
      ...prev,
      telegram_chat_ids: prev.telegram_chat_ids.filter(r => r !== recipient)
    }));
  };

  const testNotification = async () => {
    try {
      const { error } = await supabase.functions.invoke("send-telegram-notification", {
        body: {
          draft_id: "test",
          action: "approved",
          title: "Test Notification",
          category: "Test",
          reviewer_name: "System Test"
        }
      });

      if (error) throw error;

      toast({
        title: "Test Sent",
        description: "Test Telegram notification has been sent"
      });
    } catch (error: any) {
      console.error("Error sending test notification:", error);
      toast({
        title: "Error",
        description: "Failed to send test notification",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading notification settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Telegram Notifications</h2>
        <p className="text-muted-foreground">Configure Telegram notifications for article approvals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Telegram Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="bot-token">Telegram Bot Token</Label>
              <Input
                id="bot-token"
                type="text"
                value={formData.telegram_bot_token}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  telegram_bot_token: e.target.value 
                }))}
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Get this token from @BotFather on Telegram after creating your bot.
              </p>
            </div>

            <div>
              <Label>Telegram Chat IDs</Label>
              <div className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Input
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value)}
                    placeholder="Chat ID (e.g., -123456789 for groups, 123456789 for users)"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRecipient())}
                  />
                  <Button type="button" onClick={addRecipient} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {formData.telegram_chat_ids.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.telegram_chat_ids.map((recipient, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {recipient}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeRecipient(recipient)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                To get chat ID: message your bot, then visit https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Enable Telegram notifications</Label>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? "Saving..." : "Save Settings"}
              </Button>
              
              {formData.telegram_bot_token && formData.active && (
                <Button type="button" variant="outline" onClick={testNotification}>
                  Test Notification
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">n8n Integration Endpoints:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono space-y-1">
              <div><strong>Submit Draft:</strong> POST /functions/v1/n8n-submit-draft</div>
              <div><strong>Send Notification:</strong> POST /functions/v1/send-telegram-notification</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Expected JSON payload for draft submission:</h4>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              {`{
  "source_name": "BBC News",
  "source_url": "https://bbc.com",
  "original_url": "https://bbc.com/article",
  "original_title": "Original title",
  "original_content": "Original content...",
  "paraphrased_title": "Paraphrased title",
  "paraphrased_content": "Paraphrased content...",
  "paraphrased_excerpt": "Summary...",
  "suggested_category": "Technology",
  "image_url": "https://example.com/image.jpg"
}`}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};