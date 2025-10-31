import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axiosConfig from "@/config/axiosConfig";

type Role = "user" | "ai" | "system";
type Message = {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
};

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "ai",
    text: "👋 Xin chào! Mình là Gemini trợ lý. Bạn cần gì cứ hỏi nhé.",
    createdAt: Date.now(),
  },
];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !sending,
    [input, sending]
  );

  useEffect(() => {
    const t = setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      50
    );
    return () => clearTimeout(t);
  }, [messages.length]);

  const renderItem = useCallback(({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View className={`px-4 my-1 ${isUser ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[85%] rounded-2xl px-3 py-2 ${
            isUser ? "bg-primary" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-[15px] leading-5 ${isUser ? "text-white" : "text-gray-800"}`}
          >
            {item.text}
          </Text>
        </View>
        <Text className="text-[11px] text-gray-400 mt-1">
          {new Date(item.createdAt).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  }, []);

  const keyExtractor = useCallback((m: Message) => m.id, []);

  const sendMessage = useCallback(async () => {
    if (!canSend) return;
    const content = input.trim();
    const userMsg: Message = {
      id: Math.random().toString(36).slice(2),
      role: "user",
      text: content,
      createdAt: Date.now(),
    };

    setInput("");
    setSending(true);
    setMessages((prev) => [...prev, userMsg]);

    const typingId = "typing-" + Date.now();
    setMessages((prev) => [
      ...prev,
      { id: typingId, role: "ai", text: "Đang nhập…", createdAt: Date.now() },
    ]);

    try {
      const res = await axiosConfig.post("/chat", { message: content });
      const replyRaw = res?.data?.reply;
      const reply =
        typeof replyRaw === "string"
          ? replyRaw
          : JSON.stringify(replyRaw ?? "Không có phản hồi", null, 2);

      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: Math.random().toString(36).slice(2),
            role: "ai",
            text: reply,
            createdAt: Date.now(),
          })
      );
    } catch (err) {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== typingId)
          .concat({
            id: Math.random().toString(36).slice(2),
            role: "system",
            text: "⚠️ Không thể kết nối máy chủ. Thử lại sau.",
            createdAt: Date.now(),
          })
      );
    } finally {
      setSending(false);
    }
  }, [canSend, input]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-semibold text-gray-900">Gemini Chat</Text>
        <Text className="text-xs text-gray-500 mt-0.5">
          {sending ? "Đang gửi..." : "Sẵn sàng"}
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={{ paddingVertical: 12 }}
        />

        <View className="px-3 pb-4 pt-2 border-t border-gray-200 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-3">
            <TextInput
              className="flex-1 py-3 text-[15px]"
              placeholder="Nhập câu hỏi cho Gemini..."
              value={input}
              onChangeText={setInput}
              autoCapitalize="none"
              autoCorrect
              multiline
            />
            <Pressable
              onPress={sendMessage}
              disabled={!canSend}
              className={`ml-2 px-3 py-2 rounded-xl ${
                canSend ? "bg-primary" : "bg-gray-300"
              }`}
            >
              <Text className="text-white font-semibold">Gửi</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
