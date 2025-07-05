// LangChain 및 LangSmith 설정

export const langchainConfig = {
  // LangSmith 추적 설정
  tracing: {
    enabled: process.env.LANGCHAIN_TRACING_V2 === 'true',
    apiKey: process.env.LANGCHAIN_API_KEY,
    project: process.env.LANGCHAIN_PROJECT || 'blueprint-factory',
  },
  
  // OpenAI 설정
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4.1-mini',
    temperature: 0.7,
    maxTokens: 500,
  },
  
  // 환경 검증
  isConfigured: () => {
    return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
  },
  
  // LangSmith 추적 상태 확인
  isTracingEnabled: () => {
    return process.env.LANGCHAIN_TRACING_V2 === 'true' && 
           process.env.LANGCHAIN_API_KEY && 
           process.env.LANGCHAIN_API_KEY !== 'your_langsmith_api_key_here';
  }
};

// 환경 변수 로깅 (개발 환경에서만)
if (process.env.NODE_ENV === 'development') {
  console.log('LangChain Configuration:', {
    tracingEnabled: langchainConfig.isTracingEnabled(),
    project: langchainConfig.tracing.project,
    openaiConfigured: langchainConfig.isConfigured(),
  });
}