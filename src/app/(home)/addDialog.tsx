"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

// URL schema 验证
const urlSchema = z.string().url("请输入有效的URL");

export function AddDialog() {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    try {
      // 验证URL
      urlSchema.parse(link);
      setLoading(true);
      setError("");

      // 调用API获取网站信息
      const response = await fetch("/api/parse-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: link }),
      });

      if (!response.ok) {
        throw new Error("获取网站信息失败");
      }

      const data = await response.json();
      console.log("网站信息:", data);

      setLink("");
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生未知错误");
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4" />
          添加
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加</DialogTitle>
          <DialogDescription>添加一个新链接</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="请输入链接"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={loading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button onClick={handleAdd} disabled={loading}>
            {loading ? "处理中..." : "添加"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
