# Google Maps API Setup

## Required for Location Autocomplete Feature

The location input fields now use Google Places API for autocomplete functionality.

### Setup Steps:

1. **Get Google Maps API Key:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis/)
   - Create a new project or select existing one
   - Enable the "Places API" (for location autocomplete)
   - Enable the "Distance Matrix API" (for travel time/distance estimation)
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

**Location Autocomplete (Places API):**

- ✅ **Pickup Location** (ONE WAY): Google Places autocomplete
- ✅ **Drop Off Location** (ONE WAY): Google Places autocomplete
- ✅ **From Location** (BY THE HOUR): Google Places autocomplete
- ✅ **Jordan-focused results**: API restricted to Jordan (country:JO)
- ✅ **Dropdown suggestions**: Appears after typing 3+ characters
- ✅ **Click to select**: Click any suggestion to auto-fill

**Distance & Travel Time Estimation (Distance Matrix API):**

- ✅ **Real-time calculations**: Dynamic travel time and distance
- ✅ **Driving mode**: Optimized for road travel
- ✅ **Metric units**: Distance in Km, time in minutes
- ✅ **Auto-updates**: Calculates when pickup/dropoff locations change
- ✅ **Fallback handling**: Shows default values if API unavailable

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

### If distance estimation doesn't work:

1. **Check Browser Console** for distance calculation logs:

   - `Calling Distance Matrix API for: [origin] → [destination]` - API call started
   - `Distance Matrix API response:` - API response status
   - `Failed to calculate distance:` - API errors

2. **Check Network Tab** in Developer Tools:
   - Look for `/api/distance` POST requests
   - Check response status and error messages

### Common Issues:

- **"API key not configured"**: Add `GOOGLE_API_KEY` to `.env.local`
- **"No locations found"**: Try typing full addresses like "Amman Jordan"
- **"API Error: 403"**: Check if Places API and Distance Matrix API are enabled in Google Cloud Console
- **"API Error: 400"**: Check if your API key is valid
- **Distance shows fallback values**: Distance Matrix API may not be enabled or has usage limits

### Test the Setup:

**Testing Places API (Location Autocomplete):**

1. Type "amm" in any location field in the reservation form
2. You should see "🔍 Searching..."
3. Then Jordan locations should appear
4. If not, check console for error messages

**Testing Distance Matrix API (Travel Estimation):**

1. Add the DistanceTest component to any page temporarily:

   ```jsx
   import DistanceTest from "@/components/DistanceTest";

   // Add to your page component:
   <DistanceTest />;
   ```

2. Enter origin and destination locations
3. Click "Test Distance API" button
4. Check results and browser console for detailed logs
5. Successful test should show: "✅ Success: X minutes • Y Km"

**Manual Testing on Reserve Pages:**

1. Go through the reservation flow (Header → Reserve Now)
2. Enter pickup and dropoff locations
3. After selecting locations, you should see:
   "An estimated travel time of X minutes to the destination • Y Km"
4. Check browser console for detailed API logs
