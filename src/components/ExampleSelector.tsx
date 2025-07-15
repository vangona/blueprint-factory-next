'use client';

interface ExampleSelectorProps {
  selectedExample: string;
  onExampleChange: (example: string) => void;
}

const examples = [
  {
    key: 'developer',
    title: '개발자 전환',
    description: '안정적인 직장에서 웹 개발자로',
    icon: '💻',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    key: 'business',
    title: '부업 시작',
    description: '부업에서 온라인 강의 사업으로',
    icon: '💼',
    color: 'from-purple-500 to-pink-600'
  },
  {
    key: 'health',
    title: '건강 관리',
    description: '건강 욕구에서 운동 습관으로',
    icon: '💪',
    color: 'from-green-500 to-teal-600'
  }
];

export function ExampleSelector({ selectedExample, onExampleChange }: ExampleSelectorProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        예시 선택
      </h3>
      <div className="space-y-3">
        {examples.map((example) => (
          <button
            key={example.key}
            onClick={() => onExampleChange(example.key)}
            className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
              selectedExample === example.key
                ? 'border-blue-300 bg-blue-50 shadow-md'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${example.color} flex items-center justify-center text-white text-xl`}>
                {example.icon}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {example.title}
                </div>
                <div className="text-sm text-gray-600">
                  {example.description}
                </div>
              </div>
              {selectedExample === example.key && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <div className="font-medium mb-1">💡 사유 중첩 이해하기</div>
          <div className="text-blue-700">
            각 예시는 막연한 욕구에서 시작하여 여러 사유가 중첩되면서 
            구체적인 목표로 수렴되는 과정을 보여줍니다.
          </div>
        </div>
      </div>
    </div>
  );
}