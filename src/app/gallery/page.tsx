export default function GalleryPage() {
  const sampleBlueprints = [
    {
      id: 1,
      title: "스타트업 창업 청사진",
      author: "김창업",
      description: "0에서 시작해서 시리즈 A까지의 여정",
      thumbnail: "🚀",
    },
    {
      id: 2,
      title: "프리랜서 개발자 전환",
      author: "이개발",
      description: "직장에서 프리랜서로 독립하기까지",
      thumbnail: "💻",
    },
    {
      id: 3,
      title: "유튜버 100만 구독자",
      author: "박유튜브",
      description: "첫 영상부터 100만 구독자까지의 청사진",
      thumbnail: "📺",
    },
  ];

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">청사진 갤러리</h1>
        <p className="text-gray-600 mb-8">
          다른 사람들의 성공 여정을 살펴보고 영감을 얻어보세요
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleBlueprints.map((blueprint) => (
            <div 
              key={blueprint.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="text-4xl mb-4">{blueprint.thumbnail}</div>
              <h3 className="text-xl font-semibold mb-2">{blueprint.title}</h3>
              <p className="text-sm text-gray-500 mb-2">by {blueprint.author}</p>
              <p className="text-gray-700">{blueprint.description}</p>
              <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm">
                청사진 보기 →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}