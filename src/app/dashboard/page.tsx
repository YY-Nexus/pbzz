import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Dashboard() {
  // 修改这里：添加 await 关键字，因为 auth() 返回一个 Promise
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}
