import Image from "next/image";
import GroupBoard from "./component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-12">
      <h1 className="text-4xl font-old mb-8">Canvas Drawing</h1>
      <GroupBoard rows={12} cols={24} size={30} gap={10} />
    </main>
  );
}
