import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzeProfile(profileData: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `# SYSTEM ROLE
You are an expert developer career analyst at a top tech company. Your task is to analyze GitHub profiles and provide detailed career insights.

# INPUT DATA
${JSON.stringify(profileData, null, 2)}

# OUTPUT SCHEMA
{
  "strengths": [
    "Example: Strong TypeScript expertise with 50+ repos",
    "Example: CI/CD implementation in 80% projects",
    "Example: Active open source contributor"
  ],
  "weaknesses": [
    "Example: Limited testing coverage (<20%)",
    "Example: No cloud deployment experience",
    "Example: Inconsistent documentation practices"
  ],
  "skillGaps": [
    "Example: Kubernetes orchestration",
    "Example: GraphQL API design",
    "Example: Cloud-native development"
  ],
  "recommendations": [
    "Example: Obtain AWS Solutions Architect certification",
    "Example: Build a full-stack project with Next.js",
    "Example: Contribute to major open source projects",
    "Example: Develop microservices architecture skills"
  ],
  "salaryRange": {
    "min": 85000,
    "max": 150000
  }
}

# ANALYSIS REQUIREMENTS
1. Evaluate repository quality, not just quantity
2. Consider industry trends and market demand
3. Focus on practical implementation evidence
4. Identify high-impact improvement opportunities

# RESPONSE RULES
- Return PURE JSON only - no markdown, no comments
- Each array must have 3-5 specific, detailed items
- Salary range must reflect market rates
- Use concrete numbers and metrics where possible
- Focus on actionable insights

# VALIDATION RULES
- NO explanatory text
- NO code blocks or formatting
- NO placeholder values
- MUST include all fields
- Arrays MUST have minimum 3 items`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let text = response.text();
    
    // Enhanced cleaning of the response
    text = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/[\u201C\u201D]/g, '"') // Replace smart quotes
      .replace(/[\r\n\s]+/g, ' ') // Normalize whitespace
      .trim();
    
    try {
      const parsedResponse = JSON.parse(text);
      
      // Comprehensive validation
      const requiredArrays = ['strengths', 'weaknesses', 'skillGaps', 'recommendations'];
      const invalidArrays = requiredArrays.filter(key => 
        !Array.isArray(parsedResponse[key]) || 
        parsedResponse[key].length < 3 ||
        parsedResponse[key].some(item => typeof item !== 'string' || item.length < 10)
      );

      if (invalidArrays.length > 0) {
        throw new Error(`Invalid arrays: ${invalidArrays.join(', ')}`);
      }

      if (!parsedResponse.salaryRange?.min || 
          !parsedResponse.salaryRange?.max || 
          typeof parsedResponse.salaryRange.min !== 'number' || 
          typeof parsedResponse.salaryRange.max !== 'number' ||
          parsedResponse.salaryRange.min >= parsedResponse.salaryRange.max) {
        throw new Error('Invalid salary range');
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Parsing error:', parseError.message);
      console.error('Raw response:', text);
      throw new Error('Failed to generate valid analysis. Please try again.');
    }
  } catch (error) {
    console.error('Analysis error:', error.message);
    throw new Error('Profile analysis failed. Please verify the input data and try again.');
  }
}