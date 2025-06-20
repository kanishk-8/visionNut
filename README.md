# visionNut - AI-Powered Product Scanner

A React Native Expo app that uses AI to continuously detect and summarize products through the camera with real-time voice announcements and object detection overlays.

## Features

🎯 **Continuous Real-time Detection** - Stream-based object detection every 1.5 seconds  
📱 **Multiple Camera Modes** - Live AI, YOLO detection, and standard scanning  
🗣️ **Voice Assistant** - Automatic product announcements with AI-generated summaries  
📦 **Bounding Box Overlays** - Real-time object detection visualization  
📊 **Scan History** - Persistent storage of all detected products  
🤖 **AI Summaries** - Gemini AI-powered product descriptions  
⚡ **Local YOLO Backend** - Fast local object detection server

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up the YOLO Backend (Optional but Recommended)

```bash
cd backend
chmod +x setup.sh
./setup.sh
# Or on Windows: setup.bat
```

### 3. Start the Backend Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

The server will start at `http://localhost:8000`

### 4. Configure Environment

Update `.env` with your API keys:

```env
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
EXPO_PUBLIC_LOCAL_YOLO_URL=http://localhost:8000
```

For Android development, replace `localhost` with your computer's IP address:

```env
EXPO_PUBLIC_LOCAL_YOLO_URL=http://192.168.1.100:8000
```

### 5. Start the App

```bash
npm start
```

## App Structure

### Camera Modes

1. **Continuous Detection** (`camera-stream.tsx`)

   - Real-time streaming detection every 1.5 seconds
   - Voice announcements for new detections
   - Bounding box overlays
   - Auto-save high-confidence detections

2. **Live AI Scan** (`camera-realtime.tsx`)

   - Periodic detection every 8 seconds
   - Gemini AI integration
   - Manual capture mode

3. **YOLO Scan** (`camera-yolo.tsx`)
   - Single-shot YOLO detection
   - Manual trigger mode

### Key Components

- **BoundingBoxOverlay** - Renders detection boxes over camera view
- **SummaryOverlay** - Shows detailed scan results
- **VoiceAssistant** - Handles text-to-speech announcements

### Utilities

- **visionApi.ts** - Object detection APIs (YOLO, Gemini, fallbacks)
- **gemini.ts** - AI product summaries and recommendations
- **storage.ts** - Persistent scan history
- **voiceAssistant.ts** - Voice announcement system

## Backend Architecture

The YOLO backend (`backend/main.py`) provides:

- **FastAPI server** with CORS support
- **YOLOv8 object detection** with optimized streaming
- **Real-time processing** with configurable confidence thresholds
- **Normalized bounding box coordinates** for overlay rendering

### API Endpoints

- `GET /` - Health check
- `POST /detect` - Standard object detection
- `POST /detect/stream` - Optimized for real-time streaming

## Voice Assistant Features

- **Automatic announcements** for new high-confidence detections
- **Voice status toggle** in camera interface
- **Anti-spam logic** to prevent repetitive announcements
- **Product summaries** read aloud using Gemini AI

## Performance Optimizations

- **Quality reduction** for faster processing (0.3 quality)
- **Timeout handling** for API requests (3 seconds)
- **Mock fallbacks** when backend is unavailable
- **Debounced voice announcements** to prevent spam
- **Efficient re-rendering** with proper state management

## Development Tips

### Running on Android Device

1. Find your computer's IP address:

   ```bash
   # Linux/Mac
   ip addr show
   # Windows
   ipconfig
   ```

2. Update `.env`:

   ```env
   EXPO_PUBLIC_LOCAL_YOLO_URL=http://YOUR_IP:8000
   ```

3. Ensure your device and computer are on the same network

### Debugging

- Check backend logs in terminal running `python main.py`
- Use console.log outputs in app for detection debugging
- Voice assistant status shown in camera interface
- Mock data automatically used when backend unavailable

### Customizing Detection

Edit `backend/main.py` to adjust:

- Confidence threshold (default: 0.5)
- IoU threshold (default: 0.4)
- Model size (yolov8n.pt → yolov8s.pt for better accuracy)

## Troubleshooting

### Backend Issues

- **Port 8000 in use**: Kill existing processes or change port
- **Model download fails**: Ensure internet connection
- **Permission errors**: Run setup script with appropriate permissions

### App Issues

- **Camera permission**: Grant camera access in device settings
- **Voice not working**: Check device volume and text-to-speech settings
- **Detection boxes misaligned**: Verify backend returns normalized coordinates

### Network Issues

- **Android can't reach backend**: Use IP address instead of localhost
- **CORS errors**: Backend includes CORS middleware for all origins
- **Connection timeout**: Check firewall settings

## Contributing

1. Backend improvements: Enhance YOLO model or add new detection APIs
2. Voice features: Add voice commands or multilingual support
3. UI/UX: Improve camera interface or detection visualization
4. Performance: Optimize detection speed or reduce memory usage

## License

MIT License - Feel free to use and modify for your projects!
