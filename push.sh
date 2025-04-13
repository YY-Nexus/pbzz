#!/bin/bash
# 自动添加、提交和推送更改

# 获取提交信息
if [ -z "$1" ]; then
  echo "请提供提交信息"
  echo "用法: ./push.sh '提交信息'"
  exit 1
fi

# 添加所有更改
git add .

# 提交更改
git commit -m "$1"

# 推送到GitHub
git push origin main

echo "更改已推送到GitHub！"
