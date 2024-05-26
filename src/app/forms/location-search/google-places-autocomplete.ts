export interface LocationAutocompleteSuggestion {
  placeId: string;
  text: string;
  mainText: string;
  secondaryText: string;
}

export interface Suggestion {
  placePrediction: PlacePrediction;
}

export interface PlacePrediction {
  place: string;
  placeId: string;
  text: PredictionText;
  structuredFormat: StructuredFormat;
  types: string[];
}

export interface PredictionText {
  text: string;
  matches: Match[];
}

export interface StructuredFormat {
  mainText: MainText;
  secondaryText: SecondaryText;
}

export interface MainText {
  text: string;
  matches: Match[];
}

export interface SecondaryText {
  text: string;
}

export interface Match {
  endOffset: number;
}

export interface PlacesAutocompleteResponse {
  suggestions: Suggestion[];
}
