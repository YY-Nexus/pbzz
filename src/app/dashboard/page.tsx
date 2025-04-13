import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { userId } = auth();
  
  if (!userId) {
    redirect("/sign-in");
  }
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">仪表板</h1>
      <p>这是一个受保护的页面，只有登录用户才能访问。</p>
      <p className="mt-4">用户ID: {userId}</p>
    </div>
  );
}
