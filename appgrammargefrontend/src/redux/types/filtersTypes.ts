//filtersTypes.ts

export interface ForRecountVerbPersonMarker {
  frvpmId: number;
  verbPersonMarkerCombinationId: number;
  dominantActantId: number;
}

export interface VerbPersonMarkerCombinationFormula {
  vpmcId: number;
  verbPluralityTypeId: number;
  verbPersonMarkerParadigmId: number;
  verbTypeId: number;
  verbSeriesId: number;
  verbPersonMarkerCombinationFormulaDetails: number[];
}
