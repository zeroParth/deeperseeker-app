import HeaderDropDown from "@/components/HeaderDropDown";
import MessageInput from "@/components/MessageInput";
import { defaultStyles } from "@/constants/Styles";
import { storage } from "@/utils/Storage";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import ChatMessage from "@/components/ChatMessage";
import { Message, Role } from "@/utils/Interfaces";
import MessageIdeas from "@/components/MessageIdeas";
import { addChat, addMessage, getMessages } from "@/utils/Database";
import { useSQLiteContext } from "expo-sqlite";
import Colors from "@/constants/Colors";
import { Text } from "./Themed";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";
import { useApi } from "./useApi";

const ChatPage = () => {
  const [selectedModel, setSelectedModel] = useMMKVString("selectedModel", storage);
  const [height, setHeight] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const db = useSQLiteContext();
  let { id } = useLocalSearchParams<{ id: string }>();
  const scrollViewRef = useRef<ScrollView>(null);
  const [chatId, _setChatId] = useState(id);
  const chatIdRef = useRef(chatId);
  const {sendMessage, key} = useApi();
  
  useEffect(() => {
    if (id) {
      getMessages(db, parseInt(id)).then((res) => {
        setMessages(res);
      });
    }
  }, [id]);


  // https://stackoverflow.com/questions/55265255/react-usestate-hook-event-handler-using-initial-state
  function setChatId(id: string) {
    chatIdRef.current = id;
    _setChatId(id);
  }

  const onModelChange = (model: string) => {
    setSelectedModel(model);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height / 2);
  };

  const getCompletion = async (text: string) => {
    if (messages.length === 0) {
      const result = await addChat(db, text);
      const chatID = result.lastInsertRowId;
      setChatId(chatID.toString());
      await addMessage(db, chatID, { content: text, role: Role.User });
    } else {
      await addMessage(db, parseInt(chatIdRef.current), { content: text, role: Role.User });
    }

    const newMessages = [
      ...messages,
      { role: Role.User, content: text },
      { role: Role.Bot, content: "" },
    ];
    setMessages(newMessages);
    
    try {
      await sendMessage(newMessages, selectedModel || "deepseek-chat", (content: string, reasoningContent?: string) => {
        setMessages((messages) => {
          const lastMsg = messages[messages.length - 1];
            if (content) {
            lastMsg.content += content;
            }
            if (reasoningContent) {
            lastMsg.reasoning_content = (lastMsg.reasoning_content || "") + reasoningContent;
            }
          return [...messages];
        });
      });

      // Save the completed message
      setMessages((messages) => {
        const lastMessage = messages[messages.length - 1];
        addMessage(db, parseInt(chatIdRef.current), {
          content: lastMessage.content,
          role: Role.Bot,
        });
        return messages;
      });
    } catch (error) {
      console.error("Error streaming chat:", error);
      if (error instanceof Error) {
        Alert.alert("Error", `Failed to get response: ${error.message}`);
      } else {
        Alert.alert("Error", "Failed to get response");
      }
    }
  };

  if (!key) {
    return <Redirect href={'/(auth)/(modal)/settings'} />;
  }

  return (
    <View style={defaultStyles.pageContainer}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderDropDown
              title="Model"
              items={[
                { key: "deepseek-chat", title: "DeepSeek Chat", icon: "bolt" },
                { key: "deepseek-reasoner", title: "DeepSeek Reasoner", icon: "sparkles" },
              ]}
              onSelect={onModelChange}
              selected={selectedModel}
            />
          ),
        }}
      />
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={[styles.page]}
        contentContainerStyle={[styles.scrollContent, messages.length === 0 && styles.emptyContent]}
        onLayout={onLayout}
      >
        {messages.length === 0 ? (
          <View
            style={{
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <View style={[styles.logoContainer]}>
              <Ionicons name="fish" size={30} color="#fff" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Hi, I'm DeeperSeeker.</Text>
            <Text style={{ fontSize: 16, color: Colors.greyLight }}>How can I help you today?</Text>
          </View>
        ) : (
          messages.map((item, index) => <ChatMessage key={index} {...item} />)
        )}
      </KeyboardAwareScrollView>
      <KeyboardStickyView offset={{ opened: 20, closed: 0 }}>
        <View style={styles.inputContainer}>
          {messages.length === 0 && <MessageIdeas onSelectCard={getCompletion} />}
          <MessageInput onShouldSend={getCompletion} />
        </View>
      </KeyboardStickyView>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#000",
    borderRadius: 50,
  },
  image: {
    width: 30,
    height: 30,
    resizeMode: "cover",
  },
  page: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingTop: 30,
    paddingBottom: 150,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
});
export default ChatPage;
