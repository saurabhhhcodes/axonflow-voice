"""
Voice Marketplace & Universal Cross-Platform Voice Engine
Allows creators (like Saurabh) to record/upload their voice, generate universal API keys,
and export/integrate their custom cloned voice into any external platform (Twilio, Vapi, Retell AI, Bland AI, ElevenLabs API, LiveKit, Asterisk/FreePBX, Webhooks).
"""
import time
import uuid
from typing import Dict, Any, List, Optional

class VoiceMarketplace:
    def __init__(self):
        # Catalog of creator voice models
        self.voices = {
            "saurabh_energetic_pro": {
                "id": "saurabh_energetic_pro",
                "name": "Saurabh — Executive & Conversational",
                "creator": "Saurabh Kumar Bajpai",
                "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                "description": "Natural, charismatic, and authoritative Indian-accented English and Hindi tone. Engineered for high-conversion sales, clinics, luxury hospitality, and enterprise customer service.",
                "sample_text": "Hello! Welcome to our store. I can help you check real-time stock, place an order, or schedule your booking in seconds. What can I do for you today?",
                "sample_audio_url": "/assets/audio/saurabh_voice_sample.mp3",
                "setup_fee_inr": 499,
                "revenue_share_pct": 15,
                "rating": 4.98,
                "active_tenants": 18,
                "total_minutes_synthesized": 24500,
                "tags": ["Featured", "Creator Voice", "English + Hindi", "Universal API Compatible", "Sales & Support"],
                "supported_platforms": [
                    "AxonFlow Native Voice",
                    "Twilio Media Streams / TwiML",
                    "Vapi.ai Custom Voice Provider",
                    "Retell AI Custom LLM/Voice Endpoint",
                    "Bland AI Pathway Integration",
                    "LiveKit WebRTC Agent",
                    "WhatsApp Voice Notes & Audio"
                ],
                "api_endpoint": "https://api.axonflow.in/v1/tts/synthesize?voice_id=saurabh_energetic_pro",
                "cloned_at": "2026-08-16T12:00:00Z"
            },
            "ananya_warm_hospitality": {
                "id": "ananya_warm_hospitality",
                "name": "Ananya — Warm & Calm Receptionist",
                "creator": "Community Creator",
                "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                "description": "Gentle, polite, and reassuring tone tailored for luxury salons, dental spas, and wellness appointments.",
                "sample_text": "Namaste! It is a pleasure to assist you. Let me look up our earliest appointment slots for your treatment.",
                "sample_audio_url": "/assets/audio/ananya_voice_sample.mp3",
                "setup_fee_inr": 499,
                "revenue_share_pct": 15,
                "rating": 4.88,
                "active_tenants": 8,
                "total_minutes_synthesized": 7200,
                "tags": ["Hospitality", "Wellness", "Soft Spoken"],
                "supported_platforms": ["AxonFlow Native Voice", "Twilio", "Vapi.ai", "LiveKit"],
                "api_endpoint": "https://api.axonflow.in/v1/tts/synthesize?voice_id=ananya_warm_hospitality",
                "cloned_at": "2026-08-14T10:00:00Z"
            },
            "vikram_fast_dispatch": {
                "id": "vikram_fast_dispatch",
                "name": "Vikram — Crisp & High Energy",
                "creator": "Community Creator",
                "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                "description": "Fast-paced, clear, and assertive voice engineered for quick order-taking, cloud kitchens, and courier dispatch.",
                "sample_text": "Got it! Your order for two specialty burgers and fries is logged. Ready in 10 minutes at the pickup counter.",
                "sample_audio_url": "/assets/audio/vikram_voice_sample.mp3",
                "setup_fee_inr": 499,
                "revenue_share_pct": 15,
                "rating": 4.82,
                "active_tenants": 6,
                "total_minutes_synthesized": 5100,
                "tags": ["F&B", "Cloud Kitchen", "Fast Dispatch"],
                "supported_platforms": ["AxonFlow Native Voice", "Twilio", "Bland AI"],
                "api_endpoint": "https://api.axonflow.in/v1/tts/synthesize?voice_id=vikram_fast_dispatch",
                "cloned_at": "2026-08-15T08:00:00Z"
            }
        }
        
        # Licensing transactions ledger
        self.licenses = []

    def list_voices(self) -> List[Dict[str, Any]]:
        return list(self.voices.values())

    def get_voice(self, voice_id: str) -> Optional[Dict[str, Any]]:
        return self.voices.get(voice_id)

    def register_custom_voice(self, 
                              creator_name: str, 
                              voice_name: str, 
                              description: str, 
                              sample_audio_name: str, 
                              sample_text: str = "Hello! I am excited to represent your business brand.") -> Dict[str, Any]:
        """Registers a new creator cloned voice model with multi-platform export credentials."""
        voice_id = f"voice_{uuid.uuid4().hex[:8]}"
        new_voice = {
            "id": voice_id,
            "name": voice_name,
            "creator": creator_name,
            "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            "description": description,
            "sample_text": sample_text,
            "sample_audio_url": f"/assets/audio/{sample_audio_name}",
            "setup_fee_inr": 499,
            "revenue_share_pct": 15,
            "rating": 5.0,
            "active_tenants": 1,
            "total_minutes_synthesized": 0,
            "tags": ["Custom Clone", "Creator Voice", "Universal API Export"],
            "supported_platforms": [
                "AxonFlow Native Voice",
                "Twilio Media Streams / TwiML",
                "Vapi.ai Custom Voice Provider",
                "Retell AI Custom LLM/Voice Endpoint",
                "Bland AI Pathway Integration",
                "LiveKit WebRTC Agent"
            ],
            "api_endpoint": f"https://api.axonflow.in/v1/tts/synthesize?voice_id={voice_id}",
            "api_key": f"af_live_voice_{uuid.uuid4().hex[:16]}",
            "cloned_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
        self.voices[voice_id] = new_voice
        return new_voice

    def license_voice(self, tenant_id: str, voice_id: str) -> Dict[str, Any]:
        voice = self.get_voice(voice_id)
        if not voice:
            return {"error": "Voice not found in marketplace", "success": False}
            
        license_record = {
            "license_id": f"LIC-{int(time.time()) % 100000}",
            "tenant_id": tenant_id,
            "voice_id": voice_id,
            "voice_name": voice["name"],
            "creator": voice["creator"],
            "setup_fee_paid": voice["setup_fee_inr"],
            "rev_share_pct": voice["revenue_share_pct"],
            "licensed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "status": "active"
        }
        
        voice["active_tenants"] += 1
        self.licenses.append(license_record)
        
        return {
            "success": True,
            "license": license_record,
            "message": f"Successfully licensed voice '{voice['name']}'. Initialized with ₹{voice['setup_fee_inr']} setup charge and 15% revenue share."
        }

    def get_creator_pnl(self, creator_name: str = "Saurabh Kumar Bajpai") -> Dict[str, Any]:
        """Calculates total licensing and compounding rev-share earnings for creator."""
        licensed_count = sum(1 for l in self.licenses if l.get("creator") == creator_name) + 18 # base seeded
        saurabh_voice = self.voices["saurabh_energetic_pro"]
        
        upfront_rev = licensed_count * saurabh_voice["setup_fee_inr"]
        usage_billing_volume = saurabh_voice["total_minutes_synthesized"] * 15.0 # ₹15/min
        rev_share_earnings = usage_billing_volume * 0.15 # 15%
        
        return {
            "creator": creator_name,
            "active_tenants": licensed_count,
            "total_minutes_served": saurabh_voice["total_minutes_synthesized"],
            "upfront_licensing_revenue": upfront_rev,
            "ongoing_15pct_rev_share_revenue": round(rev_share_earnings, 2),
            "total_creator_earnings": round(upfront_rev + rev_share_earnings, 2)
        }

    def get_platform_integration_snippets(self, voice_id: str) -> Dict[str, Any]:
        """Returns ready-to-use copy-paste integration configs for external voice platforms."""
        voice = self.get_voice(voice_id) or self.voices["saurabh_energetic_pro"]
        endpoint = voice["api_endpoint"]
        api_key = voice.get("api_key", "af_live_voice_saurabh_pro_88a91c")

        return {
            "voice_name": voice["name"],
            "voice_id": voice["id"],
            "api_endpoint": endpoint,
            "api_key": api_key,
            "code_snippets": {
                "twilio_twiml": f"""<!-- Twilio TwiML Integration -->
<Response>
  <Say voice="Google.en-IN-Wavenet-D">Connecting to {voice['name']} on AxonFlow...</Say>
  <Connect>
    <Stream url="wss://voice.axonflow.in/stream/v1?voice_id={voice['id']}&amp;api_key={api_key}" />
  </Connect>
</Response>""",

                "vapi_json_config": f"""// Vapi.ai Custom Voice Provider Config
{{
  "voice": {{
    "provider": "custom-voice",
    "voiceId": "{voice['id']}",
    "serverUrl": "{endpoint}",
    "headers": {{
      "Authorization": "Bearer {api_key}"
    }}
  }}
}}""",

                "retell_ai_webhook": f"""// Retell AI Custom Voice Endpoint
{{
  "voice_id": "{voice['id']}",
  "tts_provider": "axonflow_custom",
  "endpoint": "{endpoint}",
  "api_key": "{api_key}"
}}""",

                "curl_synthesize": f"""# Test Direct Audio Synthesis from Terminal
curl -X POST "{endpoint}" \\
  -H "Authorization: Bearer {api_key}" \\
  -H "Content-Type: application/json" \\
  -d '{{"text": "Hello! This is Saurabh speaking through AxonFlow Voice API."}}' \\
  --output synthesized_voice.mp3"""
            }
        }

voice_marketplace = VoiceMarketplace()
