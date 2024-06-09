import { Injectable } from '@nestjs/common';
import { UserBadWordCount } from 'src/types/telegram.types';

@Injectable()
export class SharedStateService {
  badWordsCount: Map<number, Map<number, UserBadWordCount[]>> = new Map();
  timeoutMaxCount = 3;
}
