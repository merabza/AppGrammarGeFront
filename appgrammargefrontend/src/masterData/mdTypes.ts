//mdTypes.ts

export interface Classifier {
  clfId: number;
  clfKey: string;
  clfName: string;
  // derivationBranches: DerivationBranch[];
  // inflections: Inflection[];
  // inflectionVerbCompositions: InflectionVerbComposition[];
}

// derivationTypes
// inflectionTypes
export interface DerivationType {
  drtId: number;
  drtKey: string;
  drtName: string;
  morphemeGroupId: number;
  drtAutomatic: boolean;
  drtFolderName: string;
  // morphemeGroupNavigation: MorphemeGroup;
  // derivationFormulas: DerivationFormula[];
  // morphemeRangesByDerivationTypes: MorphemeRangeByDerivationType[];
}

export interface InflectionType {
  iftId: number;
  iftKey: string;
  iftName: string;
  morphemeGroupId: number;
  iftFileName: string;
  iftSometimesAttachedParticleMorphemeRangeId: number;
  // morphemeGroupNavigation: MorphemeGroup;
  // sometimesAttachedParticleMorphemeRangeNavigation: MorphemeRange;
  // inflections: Inflection[];
  // inflectionBlocks: InflectionBlock[];
}

export interface Pronoun {
  prnId: number;
  prnKey: string;
  prnName: string;
  sortId: number;
  // actantPronounsByGrammarCases: ActantPronounByGrammarCase[];
}

export interface classifierModel {}

export interface PhoneticsChangeModel {
  phcId: number;
  phoneticsTypeId: number | null;
  phoneticsOptionId: number | null;
  phoneticsTypeByOptionSequentialNumber: number;
}

export interface PhoneticsChangeQueryModel {
  phcId: number;
  phcName: string;
  onlyPhoneticsType: boolean;
}

export interface MorphemeGroup {
  mogId: number;
  mogName: string;
  mogAutoPhonetics: boolean;
}

export interface MorphemeRange {
  mrId: number;
  mrKey: string;
  mrBaseNom: number | null;
  morphemeGroupId: number;
  mrSelectable: boolean;
  mrName: string;
  mrPosition: number;
  mrInflectionSelectable: boolean;
  mrVerbCompositionSelectable: boolean;
  mrBaseRequired: boolean;
  minNom: number;
  maxNom: number;
}

export interface Morpheme {
  mrpId: number;
  mrpNom: number;
  mrpName: string;
  mrpMorpheme: string;
  morphemeRangeId: number;
  phoneticsTypeId: number | null;
}

export interface InflectionBlock {
  inbKey: string;
}

export interface InflectionType {}

// export interface DerivationType {
//   drtId: number;
//   morphemeGroupId: number;
// }

export interface MorphemeRangeByDerivationType {
  derivationTypeId: number;
  morphemeRangeId: number;
}

export interface DerivationFormula {
  dfId: number;
  derivationTypeId: number;
  formulaName: string;
  derivationFormulaDetails: number[];
}

export interface NounParadigmFormula {
  nprId: number;
  nprOrderInParadigm: number;
  nprSample: string;
  grammarCaseId: number;
  nounNumberId: number;
  morphemeIds: number[];
}

export interface VerbParadigmFormula {
  vprId: number;
  vprOrderInParadigm: number;
  vprSample: string;
  verbTypeId: number;
  verbRowId: number;
  verbPersonMarkerParadigmId: number;
  morphemeIds: number[];
}

export interface VerbPersonMarkerFormula {
  vpmprId: number;
  vpmpnKey: string;
  vprOrderInParadigm: number;
  verbPluralityTypeId: number;
  verbNumberId: number;
  verbPersonId: number;
  morphemeIds: number[];
}

export interface ParadigmNameModel {
  prdId: number;
  prdName: string;
  sortId: number;
  formulasCount: number;
  inflectionsCount: number;
}

export interface DerivationFormulaQueryModel {
  dfId: number;
  dfName: string;
  morphemeGroupId: number;
  derivationTypeId: number;
}

export interface PhoneticsType {
  phtId: number;
  phtName: string;
  phtLastLetter: number;
  phtDistance: number;
  phtNote: string | null;
  phtSlab: number;
  phtSlabCount: number;
}

export interface PhoneticsOption {
  phoId: number;
  phoName: string;
}

export interface Pronoun {}

export interface InflectionType {
  iftId: number;
  morphemeGroupId: number;
  iftKey: string;
}

export interface InflectionBlock {
  inbId: number;
  inflectionTypeId: number;
  inbContainsNecessaryBase: boolean;
}

export interface MorphemeRangeByInflectionBlock {
  inflectionBlockId: number;
  morphemeRangeId: number;
}

export interface NounParadigm {
  npnId: number;
  npnKey: string;
  npnName: string;
}

export interface VerbParadigm {
  vpnId: number;
  vpnKey: string;
  vpnName: string;
}

export interface VerbType {
  vtpId: number;
  vtpVerbPersonsCount: number;
  sortId: number;
}

export interface VerbRows {
  sortId: number;
}

export interface VerbPluralityType {
  vptId: number;
  sortId: number;
}
export interface VerbTransition {}
export interface VerbSeries {
  vsrId: number;
  sortId: number;
}
export interface VerbRow {}

export interface VerbRowFilter {}

export interface VerbPluralityType {}
export interface ActantGroups {}
export interface VerbPersons {}
export interface VerbNumbers {}
export interface VerbPerson {
  vprId: number;
  sortId: number;
}
export interface VerbNumber {
  vnmId: number;
  sortId: number;
}

export interface PersonVariabilityType {
  pvtId: number;
}

export interface PhoneticsOptionDetail {
  phodId: number;
  phoneticsOptionId: number;
  phodActOrd: number;
  phodActId: number;
  phodOrient: number;
  phodStart: number;
  phodCount: number;
  phodObject: number;
  phodNew: string | null;
}

export interface PhoneticsTypeProhibition {
  phtpId: number;
  phtpProhOrd: number;
  phtpProhId: number;
  phtpOrient: number;
  phtpStart: number;
  phtpCount: number;
  phtpObject: number;
  phtpNew: string | null;
  phoneticsTypeId: number;
}

export interface PhoneticsChange {
  phoneticsTypeId: number;
  phoneticsTypeByPhoneticsOptionOrderNom: number;
  phoneticsOptionId: number;
}

export interface GrammarCase {
  sortId: number;
}

export interface NounNumber {
  sortId: number;
}

export interface MorphemeRangeByInflectionBlock {}

export interface ActantPosition {
  apnId: number;
  sortId: number;
}
export interface ActantCombinationDetail {
  actantCombinationId: number;
  actantPositionId: number;
}

export interface ActantGrammarCasesByActantType {
  actantTypeId: number;
  verbSeriesId: number;
}
export interface ActantTypesByVerbType {
  verbTypeId: number;
  actantPositionId: number;
}
export interface DominantActant {
  actantGroupId: number;
  verbPersonId: number;
}
export interface AfterDominantPersonMarker {
  verbTypeId: number;
  verbSeriesId: number;
}
export interface ActantGrammarCase {}
export interface ActantGroup {
  agrId: number;
  agrKey: string;
}
export interface ActantType {
  attId: number;
  sortId: number;
}

export interface PluralityChangesByVerbType {
  pluralityTypeIdStart: number;
  verbTypeId: number;
  verbSeriesId: number;
}
export interface VerbPersonMarkerCombination {
  verbPluralityTypeId: number;
  verbPersonMarkerParadigmId: number;
  verbTypeId: number;
  verbSeriesId: number;
}

export interface VerbPersonMarkerParadigmChange {
  actantGroupId: number;
  verbPersonMarkerParadigmIdStart: number;
}
export interface VerbPluralityTypeChange {
  pluralityTypeIdStart: number;
  pluralityTypeDominantId: number;
  actantGroupId: number;
  verbNumberId: number;
  verbPersonId: number;
  actantTypeId: number;
}

export interface MorphemeRangesByInflectionBlock {
  inflectionBlockId: number;
  morphemeRangeId: number;
}
