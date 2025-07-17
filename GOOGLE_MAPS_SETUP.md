# Google Maps API Setup

## Required for Location Autocomplete Feature

The location input fields now use Google Places API for autocomplete functionality.

### Setup Steps:

1. **Get Google Maps API Key:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
   - Create a new project or select existing one
   - Enable the "Places API"
   - Create credentials (API Key)

2. **Set Environment Variable:**

   - Create a `.env.local` file in the project root
   - Add your API key:

   ```bash
   # Google Maps API Key for Places Autocomplete  
   # Get your API key from: https://console.cloud.google.com/google/maps-apis/
   # Make sure to enable the Places API
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

3. **Install Dependencies:**
   ```bash
   npm install @googlemaps/google-maps-services-js
   ```

### Features Implemented:

- ✅ **Pickup Location** (ONE WAY): Google Places autocomplete
- ✅ **Drop Off Location** (ONE WAY): Google Places autocomplete
- ✅ **From Location** (BY THE HOUR): Google Places autocomplete
- ✅ **Jordan-focused results**: API restricted to Jordan (country:JO)
- ✅ **Dropdown suggestions**: Appears after typing 3+ characters
- ✅ **Click to select**: Click any suggestion to auto-fill

### Usage:

1. Start typing in any location field
2. After 3 characters, Google suggestions will appear
3. Click on any suggestion to select it
4. The field will be auto-filled with the selected location

### API Configuration:

- **Country restriction**: Jordan only (`components: ["country:JO"]`)
- **Debouncing**: Triggered after 3+ characters
- **Server-side**: API calls made securely from server actions

## Troubleshooting:

### If autocomplete doesn't work:

1. **Check Browser Console**: Open Developer Tools → Console tab for debug logs
2. **Look for these messages**:
   - `🔤 User typing in [field] field: [text]` - User input detected
   - `🌐 Making Google Places API request...` - API call started
   - `✅ Google API Response:` - Success with results count
   - `❌ Google Autocomplete Error:` - API errors

### Common Issues:

- **"API key not configured"**: Add `GOOGLE_API_KEY` to `.env.local`
- **"No locations found"**: Try typing full addresses like "Amman Jordan"
- **"API Error: 403"**: Check if Places API is enabled in Google Cloud Console
- **"API Error: 400"**: Check if your API key is valid

### Test the Setup:

1. Type "amm" in any location field
2. You should see "🔍 Searching..." 
3. Then Jordan locations should appear
4. If not, check console for error messages
