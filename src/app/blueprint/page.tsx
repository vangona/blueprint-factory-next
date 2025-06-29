import BlueprintCanvas from '@/components/BlueprintCanvas';

export default function BlueprintPage() {
  return (
    <div className="w-full h-screen">
      <h1 className="text-2xl font-bold p-4">내 청사진</h1>
      <div className="w-full h-[calc(100vh-80px)]">
        <BlueprintCanvas blueprintId="default" />
      </div>
    </div>
  );
}