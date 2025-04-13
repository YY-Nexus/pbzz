// 简化的中间件，不执行任何认证
export function middleware() {
  // 不执行任何操作，只是通过请求
  return
}

export const config = {
  matcher: ["/((?!api/trpc|_next/static|_next/image|favicon.ico).*)"],
}
