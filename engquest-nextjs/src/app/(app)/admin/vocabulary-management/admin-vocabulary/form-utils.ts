import type {
  VocabularyFormState,
  VocabularyItem,
} from "./types";

export const mapVocabularyToFormState = (
  item: VocabularyItem
): VocabularyFormState => ({
  word: item.word,
  ipa: item.ipa ?? "",
  meaning: item.meaning,
  example: item.example ?? "",
  example_meaning: item.example_meaning ?? "",
  category_id: item.category_id,
  image: item.media?.image ?? "",
  audio: item.media?.audio ?? "",
  video: item.media?.video ?? "",
});

export const isVocabularyFormValid = (formState: VocabularyFormState) =>
  Boolean(
    formState.word.trim() &&
      formState.meaning.trim() &&
      formState.category_id
  );

export const buildVocabularyPayload = (formState: VocabularyFormState) => ({
  word: formState.word.trim(),
  ipa: formState.ipa.trim(),
  meaning: formState.meaning.trim(),
  example: formState.example.trim(),
  example_meaning: formState.example_meaning.trim(),
  category_id: formState.category_id,
  media: {
    image: formState.image.trim(),
    audio: formState.audio.trim(),
    video: formState.video.trim(),
  },
});
