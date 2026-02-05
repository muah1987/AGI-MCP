---
description: Browser automation and web testing using Playwright - navigate websites, interact with elements, capture screenshots, and test web applications
argument-hint: [action] [parameters]
model: inherit
---

# Playwright Browser Automation

Automate browser interactions and web testing using the Playwright MCP tools. This skill provides comprehensive browser automation capabilities including navigation, element interaction, form filling, screenshots, and testing.

## Variables

ACTION: $1 - The Playwright action to perform
PARAMETERS: $2 - Action-specific parameters as JSON

## Available Actions

### Navigation

**navigate** - Go to a URL
```json
{
  "url": "https://example.com"
}
```

**navigate_back** - Go back to previous page
```json
{}
```

### Page Inspection

**snapshot** - Capture accessibility snapshot of current page
```json
{}
```

**take_screenshot** - Capture screenshot
```json
{
  "filename": "screenshot.png",
  "fullPage": true,
  "type": "png|jpeg"
}
```

**console_messages** - Get all console messages
```json
{}
```

**network_requests** - Get all network requests since page load
```json
{}
```

### Element Interaction

**click** - Click on an element
```json
{
  "element": "Submit button",
  "ref": "element-ref-from-snapshot",
  "button": "left|right|middle",
  "doubleClick": false
}
```

**hover** - Hover over an element
```json
{
  "element": "Menu item",
  "ref": "element-ref-from-snapshot"
}
```

**type** - Type text into an editable element
```json
{
  "element": "Email input field",
  "ref": "element-ref-from-snapshot",
  "text": "user@example.com",
  "slowly": false,
  "submit": false
}
```

**press_key** - Press a keyboard key
```json
{
  "key": "Enter|Escape|ArrowLeft|Tab|a"
}
```

### Form Operations

**fill_form** - Fill multiple form fields
```json
{
  "fields": [
    {
      "name": "Email field",
      "type": "textbox",
      "ref": "element-ref",
      "value": "user@example.com"
    },
    {
      "name": "Password field",
      "type": "textbox",
      "ref": "element-ref",
      "value": "password123"
    },
    {
      "name": "Remember me",
      "type": "checkbox",
      "ref": "element-ref",
      "value": "true"
    }
  ]
}
```

**select_option** - Select dropdown option
```json
{
  "element": "Country dropdown",
  "ref": "element-ref-from-snapshot",
  "values": ["USA"]
}
```

**file_upload** - Upload files
```json
{
  "paths": ["/path/to/file1.pdf", "/path/to/file2.png"]
}
```

### Advanced Interactions

**drag** - Drag and drop between elements
```json
{
  "startElement": "Draggable item",
  "startRef": "start-element-ref",
  "endElement": "Drop zone",
  "endRef": "end-element-ref"
}
```

**evaluate** - Execute JavaScript on page
```json
{
  "function": "() => { return document.title; }"
}
```

### Dialog Handling

**handle_dialog** - Accept or dismiss dialogs
```json
{
  "accept": true,
  "promptText": "Optional text for prompt dialogs"
}
```

### Browser Management

**resize** - Resize browser window
```json
{
  "width": 1920,
  "height": 1080
}
```

**close** - Close the browser page
```json
{}
```

**tabs** - Manage browser tabs
```json
{
  "action": "list|new|close|select",
  "index": 0
}
```

### Waiting

**wait_for** - Wait for conditions
```json
{
  "text": "Loading complete",
  "textGone": "Loading...",
  "time": 5
}
```

## Common Workflows

### Login Flow
1. Navigate to login page
2. Snapshot to get element references
3. Fill form with username/password
4. Click submit button
5. Wait for redirect/success message
6. Take screenshot to verify

### Web Scraping
1. Navigate to target URL
2. Snapshot to inspect page structure
3. Evaluate JavaScript to extract data
4. Navigate to next page if pagination
5. Repeat and collect results

### Form Testing
1. Navigate to form page
2. Snapshot to identify all fields
3. Fill form with test data
4. Submit form
5. Snapshot to check validation
6. Take screenshot of results

### UI Testing
1. Navigate to application
2. Perform user interactions (click, type, select)
3. Take screenshots at each step
4. Verify expected elements appear
5. Check console for errors
6. Validate network requests

### Automated Navigation
1. Navigate to starting page
2. Snapshot to find navigation elements
3. Click through menu/links
4. Take screenshots of each page
5. Collect network data
6. Verify all pages load correctly

## Best Practices

- **Always snapshot first** - Get element references before interacting
- **Use descriptive element names** - Makes debugging easier
- **Wait appropriately** - Allow time for dynamic content to load
- **Handle errors gracefully** - Dialogs and popups may appear unexpectedly
- **Take screenshots** - Visual confirmation of state
- **Check console messages** - Catch JavaScript errors
- **Monitor network** - Verify API calls complete successfully
- **Use accessibility snapshots** - Better than screenshots for automation
- **Clean up** - Close browser when done
- **Test responsively** - Resize browser for different viewports

## Example Usage

**Navigate and login:**
```
Action: navigate
Parameters: {"url": "https://app.example.com/login"}

Action: snapshot
Parameters: {}

Action: fill_form
Parameters: {
  "fields": [
    {"name": "email", "type": "textbox", "ref": "input-1", "value": "test@example.com"},
    {"name": "password", "type": "textbox", "ref": "input-2", "value": "password123"}
  ]
}

Action: click
Parameters: {"element": "Login button", "ref": "button-1"}

Action: wait_for
Parameters: {"text": "Dashboard", "time": 10}

Action: take_screenshot
Parameters: {"filename": "logged-in.png", "fullPage": true}
```

**Extract data from page:**
```
Action: navigate
Parameters: {"url": "https://example.com/data"}

Action: evaluate
Parameters: {"function": "() => Array.from(document.querySelectorAll('.item')).map(el => el.textContent)"}
```

**Test form validation:**
```
Action: navigate
Parameters: {"url": "https://example.com/signup"}

Action: snapshot
Parameters: {}

Action: fill_form
Parameters: {"fields": [{"name": "email", "type": "textbox", "ref": "input-1", "value": "invalid-email"}]}

Action: click
Parameters: {"element": "Submit", "ref": "button-1"}

Action: snapshot
Parameters: {}
// Check snapshot for validation error messages
```

## Error Handling

- Navigation timeouts - Increase wait time or check URL
- Element not found - Take snapshot to verify element exists
- Dialog interference - Use handle_dialog to dismiss
- Network issues - Check network_requests for failed calls
- JavaScript errors - Check console_messages for details
- Upload failures - Verify file paths are absolute and accessible

## Security Considerations

- Never automate with real credentials in production
- Use test/staging environments
- Be mindful of rate limiting
- Respect robots.txt and terms of service
- Don't scrape without permission
- Sanitize any user input used in automation
- Use environment variables for sensitive data
