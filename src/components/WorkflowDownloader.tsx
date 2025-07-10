import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const WorkflowDownloader: React.FC = () => {
  const workflowData = {
    "name": "WhatsApp Article Notifications",
    "nodes": [
      {
        "parameters": {
          "httpMethod": "POST",
          "path": "article-notification",
          "options": {}
        },
        "id": "webhook-trigger",
        "name": "Webhook",
        "type": "n8n-nodes-base.webhook",
        "typeVersion": 1,
        "position": [240, 300],
        "webhookId": "auto-generated"
      },
      {
        "parameters": {
          "authentication": "phoneNumberId",
          "resource": "message",
          "operation": "send",
          "recipientPhoneNumber": "={{ $json.recipients.join(',') }}",
          "messageType": "text",
          "message": "📰 *Article {{ $json.action | upper }}*\n\n*Title:* {{ $json.title }}\n*Category:* {{ $json.category }}\n{% if $json.reviewer_name %}*Reviewer:* {{ $json.reviewer_name }}\n{% endif %}\n{% if $json.action === 'approved' %}✅ This article has been published and is now live!{% else %}❌ This article was rejected and will not be published.{% endif %}\n\n*Draft ID:* {{ $json.draft_id }}"
        },
        "id": "whatsapp-send",
        "name": "WhatsApp Business",
        "type": "n8n-nodes-base.whatsApp",
        "typeVersion": 1,
        "position": [460, 300],
        "credentials": {
          "whatsAppApi": {
            "id": "1",
            "name": "WhatsApp Business API"
          }
        }
      },
      {
        "parameters": {
          "conditions": {
            "options": {
              "caseSensitive": true,
              "leftValue": "",
              "typeValidation": "strict"
            },
            "conditions": [
              {
                "id": "condition-1",
                "leftValue": "={{ $json.recipients }}",
                "rightValue": "",
                "operator": {
                  "type": "array",
                  "operation": "notEmpty"
                }
              }
            ],
            "combinator": "and"
          },
          "options": {}
        },
        "id": "check-recipients",
        "name": "Check Recipients",
        "type": "n8n-nodes-base.if",
        "typeVersion": 2,
        "position": [350, 300]
      }
    ],
    "connections": {
      "Webhook": {
        "main": [
          [
            {
              "node": "Check Recipients",
              "type": "main",
              "index": 0
            }
          ]
        ]
      },
      "Check Recipients": {
        "main": [
          [
            {
              "node": "WhatsApp Business",
              "type": "main",
              "index": 0
            }
          ]
        ]
      }
    },
    "active": false,
    "settings": {
      "executionOrder": "v1"
    },
    "versionId": "1",
    "meta": {
      "templateCredsSetupCompleted": true,
      "instanceId": "your-instance-id"
    },
    "id": "whatsapp-workflow",
    "tags": []
  };

  const downloadWorkflow = () => {
    const dataStr = JSON.stringify(workflowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'n8n-whatsapp-workflow.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-card">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">n8n WhatsApp Workflow</h3>
        <p className="text-muted-foreground text-sm">
          Download the workflow JSON file to import into your n8n instance
        </p>
      </div>
      
      <Button onClick={downloadWorkflow} className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Download Workflow JSON
      </Button>
      
      <div className="text-xs text-muted-foreground text-center max-w-md">
        <p>After downloading:</p>
        <ol className="list-decimal list-inside text-left mt-2 space-y-1">
          <li>Import this file into n8n</li>
          <li>Configure your WhatsApp Business credentials</li>
          <li>Copy the webhook URL from the Webhook node</li>
          <li>Paste it into your admin notification settings</li>
        </ol>
      </div>
    </div>
  );
};

export default WorkflowDownloader;