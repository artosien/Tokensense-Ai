import json
import os

video_planner_data = {
    "shell": {
      "title": "Video Token Budget Planner",
      "description": "Estimate and compare AI video processing costs across providers.",
      "mode_simple": "Simple",
      "mode_advanced": "Advanced",
      "config_title": "Configuration",
      "analysis_title": "Visual Analysis",
      "no_video_title": "No video analyzed yet",
      "no_video_description": "Upload a file or paste a URL on the left to start planning your token budget and comparing provider costs.",
      "privacy_title": "Privacy & Security",
      "privacy_description": "Tokensense is a client-side tool. Your video data is processed locally in your browser for file uploads. API keys are stored in your browser's localStorage and are never sent to our servers. External URL analysis is performed via a secure proxy that does not store your content.",
      "methodology_title": "Calculation Methodology",
      "methodology_description": "Estimates are based on published tokenization rates for Gemini, Claude, and GPT-4o models. Actual costs may vary slightly based on specific prompt overhead and provider-side adjustments."   
    },
    "input": {
      "upload_title": "Upload a video file",
      "upload_description": "Drag and drop or click to browse",
      "upload_limit": "MP4, MOV, WEBM, MKV (Up to 2GB)",
      "url_divider": "Or process from URL",
      "url_placeholder": "Paste YouTube, Vimeo, or direct video link...",
      "analyze_button": "Analyze",
      "error_title": "Analysis Failed",
      "loading_text": "Extracting metadata & analyzing video streams..."
    },
    "metadata": {
      "duration": "Duration",
      "resolution": "Resolution",
      "fps": "FPS",
      "audio": "Audio",
      "size": "Size",
      "audio_included": "Included",
      "audio_none": "None",
      "res_4k": "4K (Ultra HD)",
      "res_1080p": "1080p (Full HD)",
      "res_720p": "720p (HD)",
      "res_480p": "480p (SD)"
    },
    "config": {
      "title": "Parameters",
      "description": "Adjust sampling and context settings",
      "i_want_to": "I want to...",
      "sampling_rate": "Sampling Rate (FPS)",
      "sampling_hint": "Higher FPS increases visual detail but significantly increases token cost.",
      "sampling_recommendation": "1 FPS is recommended for most tasks.",
      "prompt_tokens": "Prompt Tokens",
      "tokens_unit": "tokens",
      "process_audio": "Process Audio",
      "process_audio_desc": "Include audio stream in analysis"
    },
    "results": {
      "title": "Analysis Results",
      "footprint": "Estimated footprint: {tokens}",
      "reset": "Reset",
      "cost_comparison": "Cost Comparison",
      "measure_exactly": "Measure Exactly",
      "estimate_mode": "Estimate Mode",
      "pricing_disclaimer": "Pricing last updated: March 2026. Includes input tokens only. Output costs vary by response length."
    },
    "keys": {
      "title": "API Keys",
      "privacy_title": "Privacy First",
      "privacy_description": "Keys are saved in your browser's localStorage only. They are never sent to our servers. All provider calls happen directly from your browser.",
      "get_key": "Get key ↗",
      "save": "Save",
      "saved": "Saved",
      "clear_all": "Clear all saved keys",
      "clear_all_confirm": "Are you sure you want to clear all saved API keys?",
      "exact_measure_hint": "Connect a key to enable Exact Measurement mode."
    },
    "recommendation": {
      "strategy_label": "Recommended Strategy",
      "tips_label": "Optimization Tips"
    },
    "table": {
      "col_model": "Model",
      "col_cost": "Cost",
      "col_status": "Status",
      "best_value": "Best Value",
      "ready": "Ready"
    }
}

files = [
    "messages/hi.json",
    "messages/ar.json",
    "messages/de.json",
    "messages/es.json",
    "messages/fr.json",
    "messages/id.json",
    "messages/ja.json",
    "messages/ko.json",
    "messages/pt-BR.json"
]

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data["video_planner"] = video_planner_data
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {file_path}")
    else:
        print(f"File not found: {file_path}")
