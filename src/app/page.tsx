import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        <h1 className="text-4xl font-bold text-center">
          청사진 제작소
        </h1>
        <p className="text-xl text-center max-w-2xl">
          당신의 꿈과 목표를 시각화하고, 다른 사람들의 청사진에서 영감을 얻어보세요
        </p>
        
        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <Link
            href="/blueprint"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            내 청사진 만들기
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            청사진 갤러리 보기
          </Link>
        </div>
      </main>
    </div>
  );
}