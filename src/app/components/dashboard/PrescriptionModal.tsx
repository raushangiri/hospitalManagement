import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus, Trash2, Printer, Send, Search, Heart, Mic, MicOff, Zap } from "lucide-react";
import { medicines } from "../../data/mockData";

interface PrescriptionRow {
  name: string; dose: string; freq: string; duration: string;
  route: string; instructions: string;
}

interface Props {
  open: boolean;
  patientName?: string;
  patientAge?: number;
  patientUhid?: string;
  onClose: () => void;
}

const emptyRow = (): PrescriptionRow => ({ name: "", dose: "", freq: "Twice daily", duration: "7 days", route: "Oral", instructions: "After food" });

// Parse voice transcript into medicine rows
function parseVoiceTranscript(text: string): PrescriptionRow[] {
  const rows: PrescriptionRow[] = [];
  // Match patterns like "Tab Metoprolol 50mg twice daily after food" or "aspirin 75mg once daily"
  const lines = text.split(/[,\n.;]/).map(l => l.trim()).filter(Boolean);
  for (const line of lines) {
    const lower = line.toLowerCase();
    // Find matching medicine from DB
    const match = medicines.find(m => lower.includes(m.name.toLowerCase().split(" ").slice(-1)[0].toLowerCase()));
    if (match) {
      rows.push({ ...match });
    } else {
      // Parse generic pattern: [name] [dose] [frequency] [duration]
      const doseMatch = line.match(/(\d+\s*(?:mg|mcg|ml|units?|g))/i);
      const freqMap: Record<string, string> = {
        "once": "Once daily", "twice": "Twice daily", "thrice": "Thrice daily",
        "morning": "Once daily", "night": "Once at night", "sos": "SOS",
        "three times": "Thrice daily", "two times": "Twice daily",
      };
      let freq = "Once daily";
      for (const [key, val] of Object.entries(freqMap)) {
        if (lower.includes(key)) { freq = val; break; }
      }
      const durationMatch = line.match(/(\d+\s*(?:days?|weeks?|months?))/i);
      if (doseMatch || line.length > 3) {
        rows.push({
          name: line.replace(/\d+\s*(?:mg|mcg|ml|units?|g).*/i, "").trim() || line,
          dose: doseMatch?.[1] || "",
          freq,
          duration: durationMatch?.[1] || "7 days",
          route: "Oral",
          instructions: "After food",
        });
      }
    }
  }
  return rows.filter(r => r.name.length > 2);
}

declare global {
  interface Window {
    SpeechRecognition: new() => SpeechRecognition;
    webkitSpeechRecognition: new() => SpeechRecognition;
  }
  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    onend: (() => void) | null;
  }
  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
  interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }
  interface SpeechRecognitionResult {
    isFinal: boolean;
    [index: number]: SpeechRecognitionAlternative;
  }
  interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
  }
}

export function PrescriptionModal({ open, patientName = "", patientAge = 0, patientUhid = "", onClose }: Props) {
  const [diagnosis, setDiagnosis] = useState("");
  const [rows, setRows] = useState<PrescriptionRow[]>([emptyRow()]);
  const [advice, setAdvice] = useState("• Rest adequately\n• Follow up as scheduled\n• Avoid spicy / oily food");
  const [followUp, setFollowUp] = useState("");
  const [search, setSearch] = useState("");
  const [searchRowIdx, setSearchRowIdx] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);
  const [printed, setPrinted] = useState(false);

  // Voice prescription state
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [parsedRows, setParsedRows] = useState<PrescriptionRow[]>([]);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const filteredMeds = search.length > 1
    ? medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const addRow = () => setRows(r => [...r, emptyRow()]);
  const removeRow = (i: number) => setRows(r => r.filter((_, idx) => idx !== i));
  const updateRow = (i: number, field: keyof PrescriptionRow, value: string) =>
    setRows(r => r.map((row, idx) => idx === i ? { ...row, [field]: value } : row));

  const fillFromDb = (rowIdx: number, med: typeof medicines[0]) => {
    setRows(r => r.map((row, i) => i === rowIdx ? { ...med } : row));
    setSearch(""); setSearchRowIdx(null);
  };

  // Voice prescription
  const startVoice = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setVoiceError("Speech recognition not supported in this browser. Use Chrome or Edge.");
      return;
    }
    setVoiceError("");
    setVoiceTranscript("");
    setInterimTranscript("");
    setParsedRows([]);

    const rec = new SpeechRec();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-IN";

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript + " ";
        else interim += r[0].transcript;
      }
      setVoiceTranscript(final);
      setInterimTranscript(interim);
      if (final.trim()) {
        const parsed = parseVoiceTranscript(final);
        setParsedRows(parsed);
      }
    };

    rec.onerror = () => {
      setVoiceError("Could not access microphone. Please allow microphone permission.");
      setIsListening(false);
    };

    rec.onend = () => setIsListening(false);

    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const applyVoicePrescription = () => {
    if (parsedRows.length > 0) {
      setRows(parsedRows);
      setVoiceMode(false);
      setVoiceTranscript("");
      setParsedRows([]);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => { recognitionRef.current?.stop(); };
  }, []);

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const html = `<!DOCTYPE html><html><head><style>
      body{font-family:Arial,sans-serif;margin:0;padding:20px;color:#1B2B3A}
      .header{display:flex;align-items:center;gap:12px;border-bottom:2px solid #2A9D8F;padding-bottom:12px;margin-bottom:16px}
      .logo{width:40px;height:40px;background:#2A9D8F;border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-weight:bold;font-size:18px}
      h1{margin:0;color:#2A9D8F;font-size:22px}
      .sub{color:#6B7280;font-size:12px}
      .info-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;background:#F4F6F9;padding:12px;border-radius:8px;margin-bottom:16px}
      .info-item label{font-size:10px;color:#9CA3AF;display:block;text-transform:uppercase}
      .info-item span{font-weight:600;font-size:13px}
      .rx{font-size:32px;color:#2A9D8F;font-weight:bold;margin:8px 0 4px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin:8px 0}
      th{background:#2A9D8F;color:white;padding:6px 8px;text-align:left}
      td{padding:6px 8px;border-bottom:1px solid #EEF0F5}
      tr:nth-child(even) td{background:#F9FAFB}
      .advice{margin-top:14px;background:#F0F9F7;padding:12px;border-radius:8px;font-size:12px;white-space:pre-line}
      .footer{margin-top:24px;display:flex;justify-content:space-between;border-top:1px solid #EEF0F5;padding-top:12px}
      .sig{text-align:right}
      @media print{button{display:none}}
    </style></head><body>
    <div class="header">
      <div class="logo">M</div>
      <div><h1>MedFlow Hospital</h1><div class="sub">12 Healthcare Avenue, New Delhi – 110001 | Ph: +91 11 4567 8900</div></div>
    </div>
    <div class="info-grid">
      <div class="info-item"><label>Patient Name</label><span>${patientName}</span></div>
      <div class="info-item"><label>Age / Gender</label><span>${patientAge} years</span></div>
      <div class="info-item"><label>UHID</label><span>${patientUhid}</span></div>
      <div class="info-item"><label>Date</label><span>${new Date().toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"})}</span></div>
      <div class="info-item"><label>Doctor</label><span>Dr. Rajesh Sharma</span></div>
      <div class="info-item"><label>Diagnosis</label><span>${diagnosis}</span></div>
    </div>
    <div class="rx">℞</div>
    <table>
      <thead><tr><th>#</th><th>Medicine</th><th>Dose</th><th>Frequency</th><th>Duration</th><th>Route</th><th>Instructions</th></tr></thead>
      <tbody>${rows.filter(r=>r.name).map((r,i)=>`<tr><td>${i+1}</td><td><b>${r.name}</b></td><td>${r.dose}</td><td>${r.freq}</td><td>${r.duration}</td><td>${r.route}</td><td>${r.instructions}</td></tr>`).join("")}</tbody>
    </table>
    <div class="advice"><b>General Advice:</b>\n${advice}</div>
    ${followUp ? `<p style="margin-top:12px;font-size:13px"><b>Follow-up Date:</b> ${followUp}</p>` : ""}
    <div class="footer">
      <div style="font-size:11px;color:#9CA3AF">This prescription is digitally generated by MedFlow HMS</div>
      <div class="sig"><div style="height:40px;border-bottom:1px solid #1B2B3A;width:150px"></div><div style="font-size:12px;margin-top:4px">Dr. Rajesh Sharma<br><span style="color:#6B7280">MBBS, MD, DM (Cardiology)</span></div></div>
    </div>
    <script>window.onload=()=>{window.print()}</script>
    </body></html>`;
    win.document.write(html); win.document.close();
    setPrinted(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: "white" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-border sticky top-0 bg-white z-10">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#2A9D8F" }}>
            <Heart size={16} fill="white" color="white" />
          </div>
          <div>
            <h3 style={{ margin: 0, color: "#1B2B3A" }}>Generate E-Prescription</h3>
            <p style={{ margin: 0, fontSize: "0.78rem", color: "#6B7280" }}>MedFlow Hospital · Dr. Rajesh Sharma · MBBS, MD, DM (Cardiology)</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Voice mode toggle */}
            <button
              onClick={() => { setVoiceMode(v => !v); if (isListening) stopVoice(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: voiceMode ? "rgba(230,57,70,0.1)" : "rgba(42,157,143,0.08)",
                color: voiceMode ? "#E63946" : "#2A9D8F",
                border: `1px solid ${voiceMode ? "rgba(230,57,70,0.3)" : "rgba(42,157,143,0.2)"}`,
              }}
            >
              {voiceMode ? <MicOff size={14} /> : <Mic size={14} />}
              {voiceMode ? "Close Voice" : "Voice Rx"}
            </button>
            <button
              onClick={() => setPreview(p => !p)}
              className="px-4 py-2 rounded-xl border transition-all hover:bg-muted"
              style={{ borderColor: "#2A9D8F", color: "#2A9D8F", fontSize: "0.85rem", fontWeight: 600 }}
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
              <X size={18} style={{ color: "#6B7280" }} />
            </button>
          </div>
        </div>

        {/* Voice Prescription Panel */}
        <AnimatePresence>
          {voiceMode && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden", borderBottom: "1px solid rgba(0,0,0,0.08)" }}
            >
              <div className="p-5" style={{ background: "rgba(42,157,143,0.03)" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: isListening ? "rgba(230,57,70,0.1)" : "rgba(42,157,143,0.1)", color: isListening ? "#E63946" : "#2A9D8F" }}>
                    {isListening ? <Mic size={18} className="animate-pulse" /> : <Mic size={18} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: "#1B2B3A" }}>Voice Prescription</div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>
                      Speak medicine names, doses and frequency. e.g. "Tab Metoprolol 50mg twice daily after food, Tab Aspirin 75mg once daily morning"
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    {!isListening ? (
                      <button
                        onClick={startVoice}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                        style={{ background: "#E63946", fontSize: "0.85rem" }}
                      >
                        <Mic size={15} /> Start Recording
                      </button>
                    ) : (
                      <button
                        onClick={stopVoice}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 animate-pulse"
                        style={{ background: "#E63946", fontSize: "0.85rem" }}
                      >
                        <MicOff size={15} /> Stop
                      </button>
                    )}
                    {parsedRows.length > 0 && !isListening && (
                      <button
                        onClick={applyVoicePrescription}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90"
                        style={{ background: "#2A9D8F", fontSize: "0.85rem" }}
                      >
                        <Zap size={15} /> Apply {parsedRows.length} Medicines
                      </button>
                    )}
                  </div>
                </div>

                {voiceError && (
                  <div className="px-4 py-3 rounded-xl mb-3 text-sm" style={{ background: "rgba(230,57,70,0.08)", color: "#E63946" }}>
                    ⚠ {voiceError}
                  </div>
                )}

                {/* Live transcript */}
                <div className="p-4 rounded-xl border border-border min-h-16 mb-3" style={{ background: "white", fontSize: "0.9rem" }}>
                  {voiceTranscript ? (
                    <span style={{ color: "#1B2B3A" }}>{voiceTranscript}</span>
                  ) : (
                    <span style={{ color: "#D1D5DB" }}>Transcript will appear here as you speak...</span>
                  )}
                  {interimTranscript && (
                    <span style={{ color: "#9CA3AF" }}>{interimTranscript}</span>
                  )}
                  {isListening && (
                    <span className="inline-flex items-center gap-1 ml-2">
                      <span className="w-2 h-2 rounded-full animate-ping" style={{ background: "#E63946" }} />
                      <span style={{ fontSize: "0.75rem", color: "#E63946" }}>Listening…</span>
                    </span>
                  )}
                </div>

                {/* Parsed preview */}
                {parsedRows.length > 0 && (
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#2A9D8F", marginBottom: "0.5rem" }}>
                      🎙 {parsedRows.length} Medicine(s) Detected:
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {parsedRows.map((r, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: "rgba(42,157,143,0.06)" }}>
                          <span className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: "#2A9D8F", fontSize: "0.65rem", fontWeight: 700 }}>{i + 1}</span>
                          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1B2B3A" }}>{r.name}</span>
                          <span style={{ fontSize: "0.78rem", color: "#6B7280" }}>{r.dose} · {r.freq} · {r.duration}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tip */}
                <div className="mt-3 p-3 rounded-xl" style={{ background: "rgba(74,158,218,0.06)" }}>
                  <div style={{ fontSize: "0.75rem", color: "#4A9EDA" }}>
                    💡 <strong>Tips:</strong> Say medicine names clearly separated by commas. "Tab Metoprolol 50mg twice daily, Aspirin 75mg once daily morning after food". Works best in Chrome/Edge with microphone access.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-5">
          {!preview ? (
            <div className="flex flex-col gap-5">
              {/* Patient info strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl" style={{ background: "#F4F6F9" }}>
                {[{ label: "Patient", value: patientName || "—" }, { label: "Age", value: patientAge ? `${patientAge} yrs` : "—" }, { label: "UHID", value: patientUhid || "—" }].map(f => (
                  <div key={f.label}>
                    <div style={{ fontSize: "0.7rem", color: "#9CA3AF", fontWeight: 600, letterSpacing: "0.05em" }}>{f.label.toUpperCase()}</div>
                    <div style={{ fontWeight: 700, color: "#1B2B3A" }}>{f.value}</div>
                  </div>
                ))}
              </div>

              {/* Diagnosis */}
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>DIAGNOSIS / CLINICAL NOTES</label>
                <input
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  placeholder="e.g. Hypertensive Heart Disease with breathlessness"
                  className="w-full border border-border rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors"
                  style={{ fontSize: "0.9rem" }}
                />
              </div>

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em" }}>MEDICINES</label>
                  <button onClick={addRow} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all hover:opacity-90" style={{ background: "#2A9D8F", fontSize: "0.8rem", fontWeight: 600 }}>
                    <Plus size={13} /> Add Medicine
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {rows.map((row, i) => (
                    <div key={i} className="border border-border rounded-xl p-3 bg-white relative">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: "#2A9D8F", fontSize: "0.72rem", fontWeight: 700 }}>{i + 1}</span>
                        <div className="flex-1 relative">
                          <div className="flex items-center gap-1 border border-border rounded-lg px-2 py-1.5 bg-muted focus-within:border-primary transition-colors">
                            <Search size={13} style={{ color: "#9CA3AF" }} />
                            <input
                              value={searchRowIdx === i ? search : row.name}
                              onChange={e => { setSearchRowIdx(i); setSearch(e.target.value); updateRow(i, "name", e.target.value); }}
                              onFocus={() => setSearchRowIdx(i)}
                              placeholder="Search or type medicine name..."
                              className="flex-1 bg-transparent outline-none"
                              style={{ fontSize: "0.85rem" }}
                            />
                          </div>
                          {searchRowIdx === i && filteredMeds.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-20 bg-white border border-border rounded-xl shadow-xl mt-1 max-h-44 overflow-y-auto">
                              {filteredMeds.map(med => (
                                <button
                                  key={med.name}
                                  onClick={() => fillFromDb(i, med)}
                                  className="flex items-center justify-between w-full px-3 py-2 hover:bg-muted transition-colors text-left"
                                >
                                  <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#1B2B3A" }}>{med.name}</span>
                                  <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{med.dose} · {med.freq}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button onClick={() => removeRow(i)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0" style={{ color: "#E63946" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {([["Dose", "dose", "50mg"], ["Frequency", "freq", "Twice daily"], ["Duration", "duration", "7 days"], ["Route", "route", "Oral"]] as [string, keyof PrescriptionRow, string][]).map(([label, field, ph]) => (
                          <div key={field}>
                            <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginBottom: "2px", fontWeight: 600 }}>{label.toUpperCase()}</div>
                            <input
                              value={row[field]}
                              onChange={e => updateRow(i, field, e.target.value)}
                              placeholder={ph}
                              className="w-full border border-border rounded-lg px-2 py-1.5 bg-muted outline-none text-sm focus:border-primary transition-colors"
                              style={{ fontSize: "0.82rem" }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="mt-2">
                        <div style={{ fontSize: "0.65rem", color: "#9CA3AF", marginBottom: "2px", fontWeight: 600 }}>INSTRUCTIONS</div>
                        <input
                          value={row.instructions}
                          onChange={e => updateRow(i, "instructions", e.target.value)}
                          placeholder="After food, Morning, etc."
                          className="w-full border border-border rounded-lg px-2 py-1.5 bg-muted outline-none text-sm focus:border-primary transition-colors"
                          style={{ fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>GENERAL ADVICE</label>
                  <textarea value={advice} onChange={e => setAdvice(e.target.value)} rows={4} className="w-full border border-border rounded-xl px-3 py-2.5 outline-none resize-none focus:border-primary transition-colors" style={{ fontSize: "0.85rem" }} />
                </div>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", letterSpacing: "0.04em", display: "block", marginBottom: "6px" }}>FOLLOW-UP DATE</label>
                  <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)} className="w-full border border-border rounded-xl px-3 py-2.5 outline-none focus:border-primary transition-colors" style={{ fontSize: "0.9rem" }} />
                  <div className="mt-4 p-3 rounded-xl" style={{ background: "rgba(42,157,143,0.08)" }}>
                    <p style={{ fontSize: "0.78rem", color: "#2A9D8F", margin: 0 }}>
                      ✓ Prescription will be auto-sent to patient via WhatsApp<br />
                      ✓ Pharmacy notified for dispensing<br />
                      ✓ Follow-up reminder will be scheduled
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Preview mode */
            <div className="p-4 border border-border rounded-xl" style={{ fontFamily: "Arial, sans-serif" }}>
              <div className="flex items-center gap-3 pb-4 mb-4" style={{ borderBottom: "2px solid #2A9D8F" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: "#2A9D8F" }}>M</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#2A9D8F" }}>MedFlow Hospital</div>
                  <div style={{ fontSize: "0.72rem", color: "#6B7280" }}>12 Healthcare Avenue, New Delhi – 110001 | +91 11 4567 8900</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-3 rounded-lg mb-4" style={{ background: "#F4F6F9" }}>
                {[["Patient", patientName], ["Age", `${patientAge} yrs`], ["UHID", patientUhid], ["Date", new Date().toLocaleDateString("en-IN")], ["Doctor", "Dr. Rajesh Sharma"], ["Diagnosis", diagnosis || "—"]].map(([k, v]) => (
                  <div key={k}><div style={{ fontSize: "0.65rem", color: "#9CA3AF" }}>{k.toUpperCase()}</div><div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{v}</div></div>
                ))}
              </div>
              <div style={{ fontSize: "2rem", color: "#2A9D8F", fontWeight: 700 }}>℞</div>
              <table className="w-full text-sm mb-4" style={{ borderCollapse: "collapse" }}>
                <thead><tr style={{ background: "#2A9D8F" }}>{["#","Medicine","Dose","Frequency","Duration","Route","Instructions"].map(h => <th key={h} style={{ color: "white", padding: "6px 8px", textAlign: "left", fontSize: "0.75rem" }}>{h}</th>)}</tr></thead>
                <tbody>{rows.filter(r => r.name).map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #EEF0F5" }}>
                    {[i+1, <strong>{r.name}</strong>, r.dose, r.freq, r.duration, r.route, r.instructions].map((cell, j) => (
                      <td key={j} style={{ padding: "6px 8px", fontSize: "0.8rem" }}>{cell}</td>
                    ))}
                  </tr>
                ))}</tbody>
              </table>
              <div className="p-3 rounded-lg mb-4" style={{ background: "#F0F9F7", fontSize: "0.82rem", whiteSpace: "pre-line" }}>
                <strong>General Advice:</strong><br />{advice}
              </div>
              {followUp && <p style={{ fontSize: "0.85rem" }}><strong>Follow-up Date:</strong> {new Date(followUp).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>}
              <div className="flex justify-end mt-4">
                <div className="text-right">
                  <div style={{ height: "40px", borderBottom: "1px solid #1B2B3A", width: "160px" }} />
                  <div style={{ fontSize: "0.82rem", marginTop: "4px" }}>Dr. Rajesh Sharma<br /><span style={{ color: "#6B7280" }}>MBBS, MD, DM (Cardiology)</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-border sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl border border-border hover:bg-muted transition-colors" style={{ fontWeight: 600, fontSize: "0.88rem" }}>Cancel</button>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90" style={{ background: "#1B2B3A", fontWeight: 600, fontSize: "0.88rem" }}>
              <Printer size={15} /> Print / PDF
            </button>
            <button
              onClick={() => { handlePrint(); onClose(); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all hover:opacity-90"
              style={{ background: "#2A9D8F", fontWeight: 600, fontSize: "0.88rem" }}
            >
              <Send size={15} /> Save & Send WhatsApp
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
