import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📋</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              청사진 제작소
            </h1>
          </div>
          <nav className="hidden sm:flex gap-6">
            <Link href="/blueprint" className="text-gray-600 hover:text-blue-600 transition-colors">
              내 청사진
            </Link>
            <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors">
              갤러리
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            당신의 꿈을
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              시각화하세요
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            행동활성화 이론을 기반으로 가치관부터 할일까지, 체계적인 목표 관리와 시각화를 통해 
            꿈을 현실로 만들어보세요
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/blueprint"
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl min-w-48"
            >
              <span className="relative z-10 flex items-center gap-2">
                🚀 청사진 만들기
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              href="/gallery"
              className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg min-w-48"
            >
              <span className="flex items-center gap-2">
                🎨 갤러리 둘러보기
              </span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">체계적 목표 관리</h3>
              <p className="text-gray-600 leading-relaxed">
                가치관부터 할일까지 5단계 계층으로 체계적으로 관리하고 연결점을 시각화합니다
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">실시간 진행률</h3>
              <p className="text-gray-600 leading-relaxed">
                각 목표의 진행률을 실시간으로 추적하고 시각적으로 확인할 수 있습니다
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-white text-2xl">💡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">영감 공유</h3>
              <p className="text-gray-600 leading-relaxed">
                다른 사람들의 성공 청사진에서 영감을 얻고 자신만의 길을 찾아보세요
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-gray-600">
            <p>행동활성화 이론 기반의 목표 관리 플랫폼</p>
          </div>
        </div>
      </footer>
    </div>
  );
}