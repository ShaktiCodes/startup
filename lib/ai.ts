import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

type PitchAnalysisResult = {
  overallScore: number
  categories: {
    clarity: {
      score: number
      feedback: string
      suggestions: string[]
    }
    persuasiveness: {
      score: number
      feedback: string
      suggestions: string[]
    }
    investorAppeal: {
      score: number
      feedback: string
      suggestions: string[]
    }
  }
  improvedPitch: string
  elevatorPitch: string
}

export async function analyzePitchWithAI(pitchContent: string, investorType?: string): Promise<PitchAnalysisResult> {
  // Create a detailed system prompt that instructs the AI how to analyze the pitch
  const systemPrompt = `You are an expert startup pitch analyzer with extensive experience in venture capital, startup fundraising, and pitch coaching.
Your task is to analyze startup pitches and provide detailed, constructive feedback that helps founders improve their messaging and increase their chances of securing investment.

Analyze the pitch on three key dimensions:

1. CLARITY (0-100):
   - How clear and understandable is the value proposition?
   - Is the problem statement well-defined?
   - Is the solution clearly articulated?
   - Is the business model explained effectively?
   - Is the target market clearly identified?

2. PERSUASIVENESS (0-100):
   - How compelling and convincing is the pitch?
   - Does it use strong, evidence-based arguments?
   - Does it address potential objections?
   - Does it create urgency and excitement?
   - Does it effectively communicate the unique value proposition?

3. INVESTOR APPEAL (0-100):
   - How likely is this pitch to attract investment?
   - Does it highlight market opportunity and potential returns?
   - Does it address the team's capabilities and advantages?
   - Does it include relevant metrics and traction?
   - Does it present a clear path to growth and profitability?

For each dimension, provide:
- A numerical score from 0-100
- Specific, actionable feedback highlighting strengths and weaknesses
- 3 concrete, prioritized suggestions for improvement

Then, create an improved version of the pitch that addresses all the issues you identified. This should maintain the founder's voice and core message while enhancing clarity, persuasiveness, and investor appeal.

Finally, create a concise 30-second elevator pitch version (2-3 sentences) that captures the essence of the business opportunity.

Your response must be structured as a JSON object with the following format:
{
  "overallScore": number,
  "categories": {
    "clarity": {
      "score": number,
      "feedback": string,
      "suggestions": string[]
    },
    "persuasiveness": {
      "score": number,
      "feedback": string,
      "suggestions": string[]
    },
    "investorAppeal": {
      "score": number,
      "feedback": string,
      "suggestions": string[]
    }
  },
  "improvedPitch": string,
  "elevatorPitch": string
}`

  // Add investor-specific instructions if an investor type is provided
  let investorContext = ""

  if (investorType) {
    switch (investorType) {
      case "angel":
        investorContext = `The pitch should be optimized for Angel Investors who typically:
- Focus on early-stage startups
- Value the founder's vision and passion
- Are often more willing to take risks on unproven concepts
- May invest based on personal connection to the problem or solution
- Typically invest smaller amounts ($25K-$100K) but can make decisions quickly`
        break
      case "vc":
        investorContext = `The pitch should be optimized for Venture Capital investors who typically:
- Focus on scalable businesses with high growth potential
- Require strong evidence of product-market fit and traction
- Look for clear paths to significant returns (10x+)
- Value metrics, market size, and competitive advantages
- Need to see a clear exit strategy within 5-7 years`
        break
      case "corporate":
        investorContext = `The pitch should be optimized for Corporate Investors who typically:
- Look for strategic alignment with their existing business
- Value potential synergies and integration opportunities
- Consider how the startup could enhance their market position
- May be less focused on immediate financial returns
- Often have longer investment horizons and complex decision processes`
        break
      case "impact":
        investorContext = `The pitch should be optimized for Impact Investors who typically:
- Seek both financial returns and positive social/environmental impact
- Value measurable impact metrics alongside business metrics
- Look for alignment with specific impact goals (e.g., climate, education, health)
- May accept lower financial returns for higher impact potential
- Value sustainability and long-term thinking`
        break
      default:
        investorContext = `The pitch should be optimized for general investors, balancing elements that appeal to different investor types.`
    }
  }

  // Construct the user prompt
  const userPrompt = `${
    investorContext ? investorContext + "\n\n" : ""
  }Here is the startup pitch to analyze:\n\n${pitchContent}`

  try {
    // Use the AI SDK to generate the analysis
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7, // Slightly increased temperature for more creative improvements
      maxTokens: 4000, // Ensure we have enough tokens for a comprehensive analysis
    })

    // Parse the JSON response
    const analysisResult: PitchAnalysisResult = JSON.parse(text)

    // Calculate the overall score as an average if not provided
    if (!analysisResult.overallScore) {
      const scores = [
        analysisResult.categories.clarity.score,
        analysisResult.categories.persuasiveness.score,
        analysisResult.categories.investorAppeal.score,
      ]
      analysisResult.overallScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
    }

    return analysisResult
  } catch (error) {
    console.error("Error analyzing pitch with AI:", error)
    throw new Error("Failed to analyze pitch. Please try again.")
  }
}

export async function generateInvestorMatchingTips(pitchContent: string, investorType: string): Promise<string> {
  const systemPrompt = `You are an expert in startup fundraising and investor relations with deep knowledge of different investor profiles and preferences.
Your task is to provide specific, actionable advice on how to tailor a startup pitch for a particular type of investor.
Focus on what this investor type values most, what language resonates with them, what metrics they prioritize, and how to structure the pitch to maximize appeal.
Provide concrete, specific advice that can be immediately applied to improve the pitch for this investor type.`

  let investorProfile = ""

  switch (investorType) {
    case "angel":
      investorProfile = `Angel Investors typically:
- Are high-net-worth individuals investing their own money
- Often have entrepreneurial backgrounds themselves
- Make decisions based on personal interest and connection to the founders
- Value vision, passion, and potential more than current metrics
- May mentor and provide connections in addition to capital
- Typically invest at pre-seed and seed stages`
      break
    case "vc":
      investorProfile = `Venture Capital investors typically:
- Manage funds with money from limited partners (LPs)
- Have specific investment theses and portfolio strategies
- Make data-driven decisions based on market size, traction, and growth potential
- Look for companies that can return their entire fund (100x+ potential)
- Have structured investment processes with multiple decision-makers
- Invest across various stages but often focus on Series A and beyond`
      break
    case "corporate":
      investorProfile = `Corporate Investors typically:
- Invest from a company's balance sheet rather than a dedicated fund
- Look for strategic alignment with their core business
- Value potential for partnership, acquisition, or integration
- May offer market access, customer relationships, and industry expertise
- Often have longer, more complex decision processes
- May have non-financial objectives alongside return expectations`
      break
    case "impact":
      investorProfile = `Impact Investors typically:
- Seek both financial returns and measurable social/environmental impact
- Have specific impact theses (climate, education, healthcare, etc.)
- Require impact metrics and reporting alongside financial metrics
- Value mission alignment and authentic commitment to impact
- May accept market-rate or below-market-rate returns depending on impact
- Look for scalable solutions to significant social/environmental challenges`
      break
    default:
      investorProfile = `General investors encompass a broad range of profiles with varying priorities and preferences.`
  }

  const userPrompt = `${investorProfile}

Based on this startup pitch:
  
"${pitchContent}"

Provide specific, actionable advice on how to tailor this pitch for ${investorType} investors. 
What should be emphasized? What should be added? What should be removed or de-emphasized?
What specific language, metrics, or proof points would resonate with this investor type?
How should the pitch be structured to maximize appeal?

Format your response as a clear, bulleted list of recommendations that the founder can immediately implement.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating investor matching tips:", error)
    throw new Error("Failed to generate investor matching tips. Please try again.")
  }
}

export async function compareAnalyses(previousAnalysisId: string, currentAnalysisId: string): Promise<string> {
  // In a real implementation, you would fetch the analyses from the database
  // For this example, we'll simulate the comparison with AI

  const systemPrompt = `You are an expert pitch coach who specializes in helping founders improve their pitches over time.
Your task is to compare two versions of a pitch analysis and provide insights on the improvements made and areas that still need work.
Focus on identifying patterns of improvement, highlighting the most significant changes, and suggesting next steps for continued enhancement.`

  const userPrompt = `Compare the previous pitch analysis (ID: ${previousAnalysisId}) with the current pitch analysis (ID: ${currentAnalysisId}).

Provide insights on:
1. The most significant improvements made between versions
2. Areas where the pitch has shown the most growth
3. Persistent issues that still need to be addressed
4. Recommended next steps for continued improvement

Format your response as a clear, structured analysis that helps the founder understand their progress and next steps.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    return text
  } catch (error) {
    console.error("Error comparing analyses:", error)
    throw new Error("Failed to compare analyses. Please try again.")
  }
}

