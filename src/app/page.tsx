'use client';

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  useEffect(() => {
    const texts = ['당신의 꿈을', '당신의 목표를', '당신의 비전을', '당신의 청사진을', '당신의 동기부여를'];
    const currentText = texts[currentTextIndex];
    let timeout: NodeJS.Timeout;
    
    if (typedText.length < currentText.length) {
      timeout = setTimeout(() => {
        setTypedText(currentText.slice(0, typedText.length + 1));
      }, 100);
    } else {
      timeout = setTimeout(() => {
        setTypedText('');
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
      }, 2000);
    }
    
    return () => clearTimeout(timeout);
  }, [typedText, currentTextIndex]);
  
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              청사진 제작소
            </h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
              갤러리
            </Link>
            <Link href="/branding" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
              브랜딩
            </Link>
            <Link href="/analysis" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              분석
            </Link>
            <Link href="/my-blueprints" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
              내 청사진
            </Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-4">
              <Link href="/gallery" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                갤러리
              </Link>
              <Link href="/branding" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                브랜딩
              </Link>
              <Link href="/analysis" className="text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                분석
              </Link>
              <Link href="/my-blueprints" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium text-center">
                내 청사진
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-8">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="inline-block">
                {typedText}
                <span className={`inline-block w-1 h-16 bg-gradient-to-r from-blue-600 to-purple-600 ml-2 transform-[translateY(10px)] ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
              </span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                시각화하세요
              </span>
            </h2>
          </div>
          
          <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            행동활성화 이론 기반으로 <span className="text-blue-600 font-semibold">가치관부터 할일까지</span><br /> 체계적인 목표 관리와 시각화를 통해 꿈을 현실로 만들어보세요
          </p>
          
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>심리학 이론 기반</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI 분석 지원</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>목표 시각화</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <button
              onClick={() => window.location.href = `/blueprint?id=${Date.now()}`}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl min-w-60 shadow-lg"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                청사진 만들기
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <Link
              href="/gallery"
              className="group border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:border-blue-500 hover:text-blue-600 hover:shadow-lg hover:bg-blue-50 min-w-60"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                갤러리 둘러보기
              </span>
            </Link>
          </div>
          
          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/branding"
              className="group flex items-center gap-3 text-purple-700 hover:text-purple-800 transition-colors font-medium"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span>브랜딩 문장 생성</span>
            </Link>
            
            <Link
              href="/analysis"
              className="group flex items-center gap-3 text-indigo-700 hover:text-indigo-800 transition-colors font-medium"
            >
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>AI 심층 분석</span>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">체계적 목표 관리</h3>
              <p className="text-gray-600 leading-relaxed break-keep">
                가치관부터 할일까지 계층적 구조로 체계적으로 관리하고 연결점을 시각화합니다
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">퍼스널 브랜딩</h3>
              <p className="text-gray-600 leading-relaxed break-keep">
                AI가 청사진을 분석하여 나만의 독특한 브랜딩 문장을 생성해줍니다
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI 심층 분석</h3>
              <p className="text-gray-600 leading-relaxed break-keep">
                행동 패턴, 동기 요인, 성취 스타일을 분석하여 맞춤형 성장 전략을 제공합니다
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl hover:border-green-200 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">영감 공유</h3>
              <p className="text-gray-600 leading-relaxed break-keep">
                다른 사람들의 성공 청사진에서 영감을 얻고 자신만의 길을 찾아보세요
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-gray-600">생성된 청사진</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">850+</div>
              <div className="text-gray-600">활성 사용자</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">15,000+</div>
              <div className="text-gray-600">달성된 목표</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">92%</div>
              <div className="text-gray-600">만족도</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">사용자 후기</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              청사진 제작소를 통해 목표를 달성한 사용자들의 생생한 경험담을 들어보세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">김</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">김개발자</div>
                  <div className="text-sm text-gray-600">프론트엔드 개발자</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &#34;청사진 제작소를 통해 단순히 목표를 나열하는 것이 아니라, 체계적으로 연결된 로드맵을 만들 수 있었어요. 특히 AI 분석이 제 성향을 정확히 파악해줘서 놀랐습니다.&#34;
              </p>
              <div className="flex text-yellow-400 mt-4">
                ★★★★★
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">박</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">박창업자</div>
                  <div className="text-sm text-gray-600">스타트업 CEO</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &#34;부업으로 시작했던 일이 지금은 본업이 되었어요. 청사진 제작소가 제 목표들을 단계별로 정리해주고, 브랜딩 기능까지 제공해서 정말 유용했습니다.&#34;
              </p>
              <div className="flex text-yellow-400 mt-4">
                ★★★★★
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">이</span>
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">이학습자</div>
                  <div className="text-sm text-gray-600">대학생</div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &#34;진로 고민이 많았는데, 청사진을 통해 제 가치관부터 차근차근 정리할 수 있었어요. 갤러리에서 다른 사람들의 청사진을 보면서 영감도 많이 받았습니다.&#34;
              </p>
              <div className="flex text-yellow-400 mt-4">
                ★★★★★
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative z-10">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">인기 청사진</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              다른 사용자들의 성공 청사진에서 영감을 얻어보세요
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">주니어에서 시니어 개발자로</h3>
                <p className="text-gray-600 text-sm mb-4">3년간의 체계적인 성장 로드맵</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">김</span>
                    </div>
                    <span className="text-sm text-gray-600">김개발자</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">4.9</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                <div className="text-6xl">💰</div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">부업으로 월 500만원 달성</h3>
                <p className="text-gray-600 text-sm mb-4">온라인 비즈니스 구축 전략</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">박</span>
                    </div>
                    <span className="text-sm text-gray-600">박창업자</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">4.8</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-indigo-100 to-green-100 flex items-center justify-center">
                <div className="text-6xl">🎓</div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">비전공자에서 개발자로</h3>
                <p className="text-gray-600 text-sm mb-4">체계적인 학습과 포트폴리오 구축</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">이</span>
                    </div>
                    <span className="text-sm text-gray-600">이학습자</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-shadow duration-200"
            >
              더 많은 청사진 보기
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  청사진 제작소
                </h3>
              </div>
              <p className="text-gray-600 mb-4 max-w-md">
                행동활성화 이론을 기반으로 한 과학적인 목표 관리 플랫폼입니다. 
                체계적인 시각화와 AI 분석을 통해 꿈을 현실로 만들어보세요.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.096.119.112.223.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.163-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-600">
                <li><Link href="/blueprint" className="hover:text-blue-600 transition-colors">청사진 만들기</Link></li>
                <li><Link href="/gallery" className="hover:text-blue-600 transition-colors">갤러리</Link></li>
                <li><Link href="/branding" className="hover:text-blue-600 transition-colors">브랜딩</Link></li>
                <li><Link href="/analysis" className="hover:text-blue-600 transition-colors">AI 분석</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">지원</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-blue-600 transition-colors">도움말</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">문의하기</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-blue-600 transition-colors">서비스 이용약관</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-600">
            <p>&copy; 2025 청사진 제작소. 행동활성화 이론 기반의 목표 관리 플랫폼.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}