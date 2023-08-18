//rootsTypes.ts

import { DerivationPredecessorModel } from "../../derivationTreeEditor/TypesAndSchemas/DerivationBranchDataTypeAndSchema";
import {
  InflectionPredecessorRedModel,
  VerbInflectionModel,
} from "../../derivationTreeEditor/TypesAndSchemas/InflectionDataTypeAndSchema";

export interface BasesByPagesResponse {
  baseLinks: BaseLinkType[];
}
export interface VerbsByPagesResponse {
  verbLinks: VerbInflectionModel[];
}

export interface BaseLinkType {
  dbrId: number;
  dbrBaseName: string;
  roots: RootLink[];
}

export interface RootLink {
  rootId: number;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string | null;
  rootFirstBranchId: number;
}

// export interface ParadigmModel {
//   notes: string | null;
//   nounParadigmId: number | null;
//   verbParadigmId: number | null;
//   inflectionId: number;
//   segments: ParadigmSegmentModel[];
//   samplePositions: (SamplePositionModel | null)[];
//   ispMorphemes: IndirectSpeechParticleModel[];
// }

export interface ParadigmModel {
  notes: string | null;
  nounParadigmId: number | null;
  verbParadigmId: number | null;
  inflectionId: number;
  segments: ParadigmSegmentModel[];
  samplePositions: SamplePositionModel[];
  ispMorphemes: IndirectSpeechParticleModel[];
}

export interface ParadigmSegmentModel {
  header: string | null;
  segmentId: number;
  words: WordModel[];
}

export interface WordModel {
  morphemes: string[];
  pronouns: number[];
  formulaView: string;
  sequentialNumber: number;
  allowIsp: boolean;
}

export interface SamplePositionModel {
  segmentId: number;
  sequentialNumber: number;
}

export interface IndirectSpeechParticleModel {
  ispMorphemeNom: number;
  ispMorpheme: string;
}

export interface RootFullModel {
  root: RootModel;
  branches: DerivationBranchModel[];
  verbInflections: VerbInflectionRedModel[];
  nounInflections: NounInflectionRedModel[];
  inflectionVerbCompositions: InflectionVerbCompositionRedModel[];
}

export interface DerivationBranchModel {
  dbrId: number;
  brLevel: number;
  drtId: number;
  dbrBaseName: string | null;
  recordStatusId: number;
  referenceId: number | null;
  creator: string;
  classifierId: number | null;
  derivationFormulaId: number | null;
  basePhoneticsCombId: number | null;
  freeMorphFormId: number | null;
  derivationPredecessors: DerivationPredecessorModel[];
}

export interface VerbInflectionRedModel {
  infId: number;
  inflectionTypeId: number;
  infName: string;
  infSamples: string | null;
  verbParadigmId: number;
  verbTypeId: number;
  verbPluralityTypeId: number;
  verbRowFilterId: number;
  personVariabilityCombinationId: number;
  freeMorphFormId: number | null;
  iftFileName: string;
  recordStatusId: number;
  referenceId: number | null;
  creator: string;
  classifierId: number | null;
  inflectionPredecessors: InflectionPredecessorRedModel[];
}

export interface NounInflectionRedModel {
  infId: number;
  inflectionTypeId: number;
  infName: string | null;
  infSamples: string | null;
  nounParadigmId: number;
  iftFileName: string;
  recordStatusId: number;
  referenceId: number | null;
  creator: string;
  classifierId: number | null;
  inflectionPredecessors: InflectionPredecessorRedModel[];
}

export interface InflectionVerbCompositionRedModel {
  ivcId: number;
  ivcName: string | null;
  ivcSamples: string | null;
  recordStatusId: number;
  referenceId: number | null;
  creator: string;
  classifierId: number | null;
  inflectionVerbCompositionPredecessors: InflectionVerbCompositionPredecessorModel[];
}

export interface InflectionVerbCompositionPredecessorModel {
  parentNom: number;
  parentInflectionId: number;
  lastMorphemeRangeId: number | null;
}

export interface RootModel {
  rootId: number;
  rootName: string;
  rootHomonymIndex: number;
  rootNote: string | null;
  rootFirstBranchId: number;
}
