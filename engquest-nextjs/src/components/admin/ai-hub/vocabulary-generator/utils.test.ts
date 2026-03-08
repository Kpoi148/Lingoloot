import {
  getQuizData,
  getRequestedCount,
  getWordItems,
} from "@/components/admin/ai-hub/vocabulary-generator/utils";

describe("vocabulary-generator utils", () => {
  it("caps requested count at fifty", () => {
    expect(getRequestedCount("Generate 80 travel words")).toBe(50);
  });

  it("normalizes array and single-word payloads", () => {
    expect(getWordItems({ word: "travel", meaning: "du lich" })).toEqual([
      { word: "travel", meaning: "du lich" },
    ]);
    expect(
      getWordItems([
        { word: "travel", meaning: "du lich" },
        { foo: "bar" },
      ])
    ).toEqual([{ word: "travel", meaning: "du lich" }]);
  });

  it("unwraps direct and nested quiz payloads", () => {
    const quizPayload = {
      title: "Travel Quiz",
      questions: [{ question: "Where?" }],
    };

    expect(getQuizData(quizPayload)).toEqual(quizPayload);
    expect(getQuizData({ quiz: quizPayload })).toEqual(quizPayload);
  });
});
