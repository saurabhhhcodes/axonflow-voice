from typing import Dict, Any, Optional
try:
    from backend.axonflow_voice_agent import agent_engine
except ImportError:
    from axonflow_voice_agent import agent_engine

class TelephonyBridge:
    def __init__(self):
        # Central Gateway Phone Number that tenants forward their existing SIM/landlines to
        self.gateway_number = "+91 80001 23456"

    def parse_sip_or_webhook(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Extracts original caller number and forwarded-from number (BYON)
        from Twilio/SIP standard payload or Diversion headers.
        """
        # Twilio forwards provide 'ForwardedFrom' or 'To'
        forwarded_from = request_data.get("ForwardedFrom") or request_data.get("Called") or "+91 98765 43210"
        caller_number = request_data.get("From") or "+91 99887 76655"
        speech_text = request_data.get("SpeechResult") or request_data.get("Body") or request_data.get("text", "")
        
        # Match tenant by their registered forwarded phone number
        matched_tenant = None
        for t_id, t_data in agent_engine.tenants.items():
            clean_t_num = "".join(filter(str.isdigit, t_data.get("phone_number", "")))
            clean_fwd = "".join(filter(str.isdigit, forwarded_from))
            if clean_t_num and clean_fwd and (clean_t_num in clean_fwd or clean_fwd in clean_t_num):
                matched_tenant = t_data
                break
                
        if not matched_tenant:
            matched_tenant = agent_engine.tenants["tenant_demo_salon"]

        return {
            "tenant_id": matched_tenant["id"],
            "business_name": matched_tenant["business_name"],
            "caller_number": caller_number,
            "forwarded_from": forwarded_from,
            "speech_text": speech_text
        }

    def generate_twiml_response(self, text_reply: str, voice_model: str = "Polly.Aditi") -> str:
        """Generates TwiML XML to respond back via synthetic voice call."""
        xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="{voice_model}" language="en-IN">{text_reply}</Say>
    <Gather input="speech" action="/api/voice/webhook" method="POST" timeout="3" speechTimeout="auto">
        <Say voice="{voice_model}" language="en-IN">How else may I help you today?</Say>
    </Gather>
</Response>"""
        return xml

    def get_byon_carrier_guide(self, phone_number: str) -> Dict[str, Any]:
        """Returns step-by-step 1-minute Call Forwarding instructions for major telecom providers."""
        clean_num = phone_number.replace(" ", "")
        gw = self.gateway_number.replace(" ", "")
        return {
            "business_number": phone_number,
            "gateway_number": self.gateway_number,
            "instructions": {
                "Jio": {
                    "unconditional": f"Dial *401*{gw} and press call",
                    "when_busy_or_unanswered": f"Dial *403*{gw} and press call",
                    "deactivate": "Dial *402"
                },
                "Airtel": {
                    "unconditional": f"Dial *21*{gw}# and press call",
                    "when_busy_or_unanswered": f"Dial *61*{gw}# and press call",
                    "deactivate": "Dial ##21#"
                },
                "Vodafone_Idea_Vi": {
                    "unconditional": f"Dial *21*{gw}# and press call",
                    "when_busy_or_unanswered": f"Dial *61*{gw}# and press call",
                    "deactivate": "Dial ##21#"
                },
                "Landline_BSNL_MTNL": {
                    "unconditional": f"Dial 114 {gw}",
                    "deactivate": "Dial 115"
                },
                "US_Global_Carriers": {
                    "unconditional": f"Dial *72{gw} or activate via iPhone/Android Settings -> Phone -> Call Forwarding",
                    "deactivate": "Dial *73"
                }
            }
        }

telephony_bridge = TelephonyBridge()
