// 브라우저 콘솔에서 실행할 localStorage 확인 코드

console.log('=== localStorage 확인 ===');

// 모든 blueprint 관련 키 찾기
const blueprintKeys = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  if (key && key.startsWith('blueprint-')) {
    blueprintKeys.push(key);
  }
}

console.log('Blueprint 키 목록:', blueprintKeys);

// 각 blueprint 내용 확인
blueprintKeys.forEach(key => {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    console.log(`${key}:`, {
      id: data.id,
      title: data.title,
      nodeCount: data.nodes?.length || 0,
      lastModified: data.lastModified
    });
  } catch (e) {
    console.error(`${key} 파싱 실패:`, e);
  }
});

// localStorage 전체 크기 확인
let totalSize = 0;
for (let key in localStorage) {
  if (localStorage.hasOwnProperty(key)) {
    totalSize += localStorage[key].length;
  }
}
console.log('전체 localStorage 크기:', totalSize, 'bytes');