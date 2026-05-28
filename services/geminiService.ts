import { GoogleGenAI } from "@google/genai";

export const analyzeDetail = async (title: string, context: string, imageUrl: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found. Returning mock analysis.");
    return `系统模拟分析: 针对 [${title}] 的视觉扫描已完成。检测到高密度的纹理细节与独特的光影构成。此区域似乎承载了场景叙事的关键隐喻。由于未连接到中央AI核心(API Key missing)，只能提供基础结构评估。建议进一步进行深度神经扫描。`;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash-lite-latest'; // Fast model for quick UI interaction

    // [NOTE - DO NOT GENERATE IMAGES]
    // This service analyzes the EXISTING placeholder image (passed via imageUrl) or creates a creative text description based on the title.
    // It DOES NOT generate new images. All images in the app are static placeholders intended for manual replacement.
    
    const prompt = `
      角色扮演：你是一个来自赛博朋克未来的高级视觉分析AI。
      任务：分析一张名为 "${title}" 的图像细节，该图像位于 "${context}" 的场景中。
      风格：技术性、冷峻、带有科幻色彩。使用短促有力的句子。
      
      请生成一段不超过80个汉字的分析报告，描述这个细节可能包含的材质、历史痕迹或其在场景中的功能。
      (注意：这仅是文本分析，不要尝试生成任何图片)
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "数据流中断。无法解析目标对象。";

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return "连接错误。神经链路不稳定。请重试扫描。";
  }
};