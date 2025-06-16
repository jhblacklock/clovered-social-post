# n8n Workflow Generation Guide

## Key Requirements for Working Workflows

1. **Correct JSON Structure**
```json
{
  "nodes": [...],
  "connections": {...}
}
```

2. **Node Properties Required for Each Node**
- `id`: UUID format (e.g., "b1e2c3d4-5678-4abc-9def-1234567890ab")
- `name`: Display name
- `type`: Full node type (e.g., "n8n-nodes-base.formTrigger")
- `position`: [x, y] coordinates
- `parameters`: Node-specific settings
- `typeVersion`: Version number (e.g., 2.2 for form triggers)

3. **Form Trigger Node Requirements**
```json
{
  "parameters": {
    "formTitle": "Your Title",
    "formDescription": "Your Description",
    "formFields": {
      "values": [
        {
          "name": "fieldName",
          "label": "Field Label",
          "type": "string|text|multiOptions",
          "required": true|false,
          "defaultValue": "",
          "placeholder": "Placeholder text",
          "description": "Field description"
        }
      ]
    }
  }
}
```

4. **Multi-Select Field Format**
```json
{
  "name": "platforms",
  "label": "Platforms",
  "type": "multiOptions",
  "required": true,
  "options": [
    { "name": "Display Name", "value": "actual_value" }
  ],
  "defaultValue": []
}
```

5. **Connection Format**
```json
"connections": {
  "NodeName": {
    "main": [
      [
        {
          "node": "TargetNodeName",
          "type": "main",
          "index": 0
        }
      ]
    ]
  }
}
```

## Quick Start Template

Here's a minimal template to start with:

```json
{
  "nodes": [
    {
      "id": "b1e2c3d4-5678-4abc-9def-1234567890ab",
      "name": "Your Node Name",
      "type": "n8n-nodes-base.yourNodeType",
      "position": [200, 200],
      "parameters": {
        // Node-specific parameters
      },
      "typeVersion": 1
    }
  ],
  "connections": {
    "Your Node Name": {
      "main": [
        [
          {
            "node": "Target Node Name",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

## Common Node Types
- Form Trigger: `n8n-nodes-base.formTrigger`
- HTTP Request: `n8n-nodes-base.httpRequest`
- HTML: `n8n-nodes-base.html`
- If: `n8n-nodes-base.if`
- AI Transform: `n8n-nodes-base.aiTransform`
- Split In Batches: `n8n-nodes-base.splitInBatches`

## Best Practices
1. Always include unique IDs for each node
2. Use proper typeVersion numbers
3. Include all required parameters for each node type
4. Set up connections between nodes
5. Use proper positioning to avoid node overlap

## Testing Workflows
1. Copy the complete JSON
2. Paste directly into n8n canvas
3. Verify all nodes appear with correct connections
4. Test form elements and functionality

## Example: Complete Blog Post Workflow

Here's a complete example of a blog post workflow that includes:
- Form trigger with URL and content fields
- Content extraction
- AI transformation
- Platform-specific posting

```json
{
  "nodes": [
    {
      "id": "b1e2c3d4-5678-4abc-9def-1234567890ab",
      "name": "Blog & Campaign Input",
      "type": "n8n-nodes-base.formTrigger",
      "position": [200, 200],
      "parameters": {
        "formTitle": "Submit Blog Content",
        "formDescription": "Paste a blog URL or content, and select platforms.",
        "formFields": {
          "values": [
            {
              "name": "blogUrl",
              "label": "Blog URL",
              "type": "string",
              "required": false,
              "defaultValue": "",
              "placeholder": "https://example.com/blog-post",
              "description": "Paste a blog post URL to auto-extract content."
            },
            {
              "name": "blogContent",
              "label": "Blog Content",
              "type": "text",
              "required": false,
              "defaultValue": "",
              "placeholder": "Paste blog content here...",
              "description": "Or paste the blog content directly."
            },
            {
              "name": "platforms",
              "label": "Platforms",
              "type": "multiOptions",
              "required": true,
              "options": [
                { "name": "LinkedIn", "value": "linkedin" },
                { "name": "Instagram", "value": "instagram" },
                { "name": "Facebook", "value": "facebook" },
                { "name": "X (Twitter)", "value": "x" }
              ],
              "defaultValue": []
            }
          ]
        }
      },
      "typeVersion": 2.2
    }
  ],
  "connections": {}
}
```

## How to Use This Guide

1. **For New Workflows**
   - Start with the Quick Start Template
   - Add nodes following the Node Properties requirements
   - Set up connections using the Connection Format
   - Test the workflow in n8n

2. **For Modifying Existing Workflows**
   - Export the current workflow from n8n
   - Modify the JSON following this guide
   - Import back into n8n

3. **For Troubleshooting**
   - Check node typeVersion numbers
   - Verify all required parameters are present
   - Ensure connections are properly formatted
   - Test form elements appear correctly

## Common Issues and Solutions

1. **Form Elements Not Appearing**
   - Check formFields.values structure
   - Verify typeVersion is 2.2 for form triggers
   - Ensure all required field properties are present

2. **Connection Errors**
   - Verify node names match exactly
   - Check connection format
   - Ensure proper index values

3. **Node Not Working**
   - Check typeVersion number
   - Verify all required parameters
   - Test with minimal configuration first

## Additional Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Node Reference](https://docs.n8n.io/integrations/builtin/core-nodes/)
- [n8n Community](https://community.n8n.io/) 