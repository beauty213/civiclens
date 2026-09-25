export interface SafetyScanResult {
  hasWarnings: boolean;
  warnings: string[];
  detectedTypes: ('phone' | 'exact_address' | 'pincode' | 'hostile_terms')[];
}

const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}|\b\d{10}\b/g;
const PINCODE_REGEX = /\b(500\d{3}|[1-9][0-9]{5})\b/g;
const EXACT_ADDRESS_REGEX = /\b(flat\s*(?:no\.?|#)?\s*\d+|plot\s*(?:no\.?|#)?\s*\d+|h\.?\s*no\.?\s*\d+|house\s*(?:no\.?|#)?\s*\d+|door\s*(?:no\.?|#)?\s*\d+|apt\s*(?:no\.?|#)?\s*\d+)\b/i;

const HOSTILE_KEYWORDS = [
  'kill',
  'attack',
  'destroy',
  'traitor',
  'scumbag',
  'threat',
  'idiot',
  'cheat',
];

export function scanContentSafety(text: string): SafetyScanResult {
  const warnings: string[] = [];
  const detectedTypes: ('phone' | 'exact_address' | 'pincode' | 'hostile_terms')[] = [];

  if (!text || text.trim().length === 0) {
    return { hasWarnings: false, warnings, detectedTypes };
  }

  if (PHONE_REGEX.test(text)) {
    warnings.push('Possible phone number detected. Please remove personal contact numbers.');
    detectedTypes.push('phone');
  }

  if (EXACT_ADDRESS_REGEX.test(text)) {
    warnings.push('Exact door, plot, or flat number detected. CivicLens requires broad neighborhood locations for personal safety.');
    detectedTypes.push('exact_address');
  }

  if (PINCODE_REGEX.test(text)) {
    warnings.push('Specific 6-digit postal PIN code detected. Consider naming the broader locality instead.');
    detectedTypes.push('pincode');
  }

  const lower = text.toLowerCase();
  const matchedHostile = HOSTILE_KEYWORDS.filter((word) => lower.includes(word));
  if (matchedHostile.length > 0) {
    warnings.push('Content contains emotionally charged or accusatory language. CivicLens prioritizes verifiable observations over hostile claims.');
    detectedTypes.push('hostile_terms');
  }

  return {
    hasWarnings: warnings.length > 0,
    warnings,
    detectedTypes,
  };
}
