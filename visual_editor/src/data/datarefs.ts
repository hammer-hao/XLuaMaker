import tsv from './datarefs.txt?raw';
import { parseDatarefTsv } from '../parsing/parse_dataref_tsv';
import type { Dataref } from '../types/types';

// Parse once when this module is imported
export const datarefs: Dataref[] = parseDatarefTsv(tsv);