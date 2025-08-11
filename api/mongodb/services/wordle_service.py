import hashlib
import random
from datetime import date
from typing import Optional

from .repo_service import RepoService
from ..models import InvertedIndexItem, WordOfTheDayItem, EligibleWordsItem

type MongoFilterType = dict[str, str]
type MongoFieldFilterType = dict[str, MongoFilterType]


class WordleService(RepoService):

    @staticmethod
    def _get_deterministic_seed(target_date: date) -> int:
        date_string = target_date.isoformat()
        hash_obj = hashlib.sha256(date_string.encode())

        return int.from_bytes(hash_obj.digest()[:8], byteorder="big")

    @staticmethod
    def _build_filter(length: Optional[int]) -> MongoFieldFilterType:
        if not length:
            return {}

        pattern = fr'^\w{{{length}}}$'

        return {'word': {'$regex': pattern}}

    async def _get_total_word_count(self, filter: MongoFieldFilterType = {}) -> int:
        return await self._db.bronzeIndices.count_documents(filter)

    async def _get_word_by_index(
        self,
        idx: int,
        filter: Optional[MongoFieldFilterType] = {},
    ) -> Optional[InvertedIndexItem]:
        cursor = self._db.bronzeIndices.find(filter).skip(idx).limit(1)
        document = await cursor.to_list(length=1)

        if not document:
            return None

        return InvertedIndexItem(**document[0])

    async def get_eligible_words(self, length: int) -> Optional[EligibleWordsItem]:
        filter = self._build_filter(length)

        results = await self._db.bronzeIndices.find(filter).to_list(None)

        eligible_words = [result['word'] for result in results if 'word' in result]

        if not results:
            return None

        return EligibleWordsItem(words=eligible_words)

    async def get_random_word(
            self,
            target_date: Optional[date] = None,
            length: Optional[int] = None,
    ) -> Optional[WordOfTheDayItem]:
        filter = self._build_filter(length)
        is_random = target_date is None
        total_cnt = await self._get_total_word_count(filter=filter)

        if target_date:
            seed = self._get_deterministic_seed(target_date)

            random.seed(seed)
            word_idx = random.randint(0, total_cnt - 1)
            random.seed()

            response_date = target_date.isoformat()
        else:
            word_idx = random.randint(0, int(total_cnt) - 1)
            response_date = date.today().isoformat()

        document = await self._get_word_by_index(word_idx, filter=filter)

        if not document or not document.word:
            return None

        return WordOfTheDayItem(
            word=document.word,
            date=response_date,
            is_random=is_random,
        )
