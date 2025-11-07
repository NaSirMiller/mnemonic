export interface ValidationResult {
  isValid: boolean;
  firstError: string | null;
}

export interface NumericFieldValidationResult {
  isValid: boolean;
  firstError?: string;
}
