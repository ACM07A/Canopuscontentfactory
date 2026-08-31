// Safe editorial profiles for organic explainers. They describe coordination and questions to ask;
// they do not diagnose, recommend treatment, promise outcomes, or invent clinical/price facts.
export const videoProfiles = {
  "knee-replacement-doctor": {
    title: "Considering knee replacement abroad? Start with these three questions.",
    format: "doctor-style educational explainer",
    prompt: "A fictional AI medical educator in a calm studio, speaking directly to camera with warm authority. Clearly illustrative, not a real doctor, no white-coat credentials, no hospital branding.",
    scenes: [
      "The fictional AI medical educator looks into camera and gestures to an empty checklist, opening with a clear question-led hook.",
      "The educator points to a neutral records checklist: ask what current records the hospital needs to review. Do not show patient data.",
      "The educator points to a second checklist card: ask what an estimate includes and excludes. Do not show prices or promises.",
      "The educator points to a third checklist card: ask how follow-up and communication will work after returning home.",
      "Cut to a calm coordinator organizing questions for a hospital clinical team; no interpretation or diagnosis is shown.",
      "Return to the educator for a concise takeaway and a visible general-education disclaimer; end with a consent-led enquiry CTA."
    ],
    captions: [
      "Considering knee replacement abroad? Start with three questions.",
      "First: what records will the hospital review?",
      "Second: what does the estimate include—and exclude?",
      "Third: how will follow-up communication work?",
      "Keep clinical decisions with qualified hospital teams.",
      "MedYatra helps organize questions and verified information. General education, not medical advice."
    ]
  },
  "knee-replacement": {
    title: "Planning knee replacement abroad? Start with these questions.",
    scenes: ["A family gathers their existing records and writes down questions.", "A coordinator organizes a clear checklist for the hospital review.", "Show a neutral calendar and travel folder; do not show medical claims or destinations as guarantees.", "Show a written estimate with sensitive details blurred and a note to verify inclusions and exclusions.", "Show a calm handoff from coordinator to hospital clinical team.", "End on a simple message: Ask for a documented coordination pathway."],
  },
  cardiac: {
    title: "Planning cardiac care abroad? What should you verify first?",
    scenes: ["A family member organizes recent records in a secure folder.", "A coordinator highlights questions for the hospital team, without interpreting the records.", "Show a neutral video-consult setup and a question list.", "Show a written response marked subject to hospital review and current verification.", "Show travel planning as a separate checklist from clinical decisions.", "End on a simple message: Request a documented, non-binding pathway."],
  },
  dental: {
    title: "Comparing dental care abroad? Look beyond the headline price.",
    scenes: ["A person writes down what they want clarified before contacting a hospital or clinic.", "A coordinator organizes questions about scope, timing, inclusions, and follow-up.", "Show a neutral planning board with no prices or treatment promises.", "Show two written responses being compared for assumptions and exclusions.", "Show consent-led coordination and a clear handoff to the treating team.", "End on a simple message: Ask for the details in writing."],
  },
  fertility: {
    title: "Exploring fertility care abroad? Make the unknowns visible.",
    scenes: ["A couple privately organizes their documents and questions.", "A coordinator shows a consent and records checklist without revealing personal data.", "Show a neutral timeline with clinical decisions left blank for the treating team.", "Show questions about what is included, what remains uncertain, and how follow-up works.", "Show secure communication and a documented handoff.", "End on a simple message: Start with a careful, consent-led enquiry."],
  },
  oncology: {
    title: "Researching cancer care abroad? Ask for a documented review.",
    scenes: ["A family organizes reports and a medication list without displaying patient details.", "A coordinator checks that consent and the record set are ready for hospital review.", "Show a neutral list of questions for the treating team.", "Show a written hospital response labelled current and subject to clinical review.", "Show travel and support planning separately from treatment decisions.", "End on a simple message: Clinical decisions stay with qualified hospital teams."],
  },
};

export function videoProfile(key) { return videoProfiles[key] || videoProfiles["knee-replacement"]; }
