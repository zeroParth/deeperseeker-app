import Colors from '@/constants/Colors';
import { Message, Role } from '@/utils/Interfaces';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Ionicons } from "@expo/vector-icons";

const ChatMessage = ({
  content,
  role,
  loading,
  reasoning_content,
}: Message & { loading?: boolean }) => {
  return (
    <View style={styles.row}>
      <View style={{marginTop: 10}}>
      {role === Role.Bot ? (
        <View style={[styles.item, { backgroundColor: '#000' }]}>
          <Image source={require('@/assets/images/logo-white.png')} style={styles.btnImage} />
        </View>
      ) : (
        <View style={[styles.avatar, { backgroundColor: Colors.greyLight, justifyContent: 'center', alignItems: 'center' }]}>
          <Ionicons name="person" size={20} color="#fff" />
        </View>
      )}
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={Colors.primary} size="small" />
        </View>
      ) : (
        <>
          <View style={styles.messageContainer}>
            {reasoning_content ? (
              <View style={styles.reasoningContainer}>
                <Text style={styles.reasoningText}>{reasoning_content}</Text>
              </View>
            ) : null}
            <View style={styles.markdownContainer}>
              <Markdown style={markdownStyles} mergeStyle>
                {content}
              </Markdown>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const markdownStyles = {
  body: {
    color: '#000',
    fontSize: 16,
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 2,
    fontFamily: 'Menlo',
  },
  code_block: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Menlo',
  },
  link: {
    color: Colors.primary,
  },
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    gap: 14,
    marginVertical: 12,
  },
  item: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnImage: {
    margin: 6,
    width: 16,
    height: 16,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000',
  },
  messageContainer: {
    flex: 1,
    gap: 8,
  },
  markdownContainer: {
    flex: 1,
    padding: 4,
  },
  text: {
    padding: 4,
    fontSize: 16,
    flexWrap: 'wrap',
    flex: 1,
  },
  reasoningContainer: {
    borderLeftWidth: 2,
    borderLeftColor: Colors.greyLight,
    paddingLeft: 8,
  },
  reasoningText: {
    color: Colors.greyLight,
    fontSize: 14,
  },
  previewImage: {
    width: 240,
    height: 240,
    borderRadius: 10,
  },
  loading: {
    justifyContent: 'center',
    height: 26,
    marginLeft: 14,
  },
});

export default ChatMessage;
