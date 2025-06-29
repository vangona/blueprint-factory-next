import Link from 'next/link';

export default function GalleryPage() {
  const sampleBlueprints = [
    {
      id: 1,
      title: "스타트업 창업 청사진",
      author: "김창업",
      description: "0에서 시작해서 시리즈 A까지의 여정",
      thumbnail: "🚀",
      tags: ["스타트업", "투자", "창업"],
      progress: 85,
    },
    {
      id: 2,
      title: "프리랜서 개발자 전환",
      author: "이개발",
      description: "직장에서 프리랜서로 독립하기까지",
      thumbnail: "💻",
      tags: ["개발", "프리랜서", "독립"],
      progress: 92,
    },
    {
      id: 3,
      title: "유튜버 100만 구독자",
      author: "박유튜브",
      description: "첫 영상부터 100만 구독자까지의 청사진",
      thumbnail: "📺",
      tags: ["유튜브", "콘텐츠", "구독자"],
      progress: 78,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📋</span>
              </div>
              <span className="font-semibold">청사진 제작소</span>
            </Link>
            <div className="text-gray-400">|</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              청사진 갤러리
            </h1>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="/blueprint" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              🎯 내 청사진
            </Link>
            <Link href="/" className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              🏠 홈으로
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            성공한 사람들의 청사진
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            다른 사람들의 성공 여정을 살펴보고 영감을 얻어보세요
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleBlueprints.map((blueprint) => (
            <Link
              key={blueprint.id}
              href={`/gallery/${blueprint.id}`}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105 block"
            >
              <div className="text-6xl mb-6 text-center">{blueprint.thumbnail}</div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {blueprint.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {blueprint.author.charAt(0)}
                  </span>
                </div>
                <span className="text-sm text-gray-600">by {blueprint.author}</span>
              </div>
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                {blueprint.description}
              </p>
              
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">달성률</span>
                    <span className="text-sm font-bold text-blue-600">{blueprint.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${blueprint.progress}%` }}
                    />
                  </div>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {blueprint.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-blue-600 group-hover:text-blue-700 font-semibold flex items-center gap-2">
                    청사진 보기 
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}