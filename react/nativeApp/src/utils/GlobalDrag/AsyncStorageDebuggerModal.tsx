// AsyncStorageDebuggerModal.tsx
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface KeyValueItem {
  key: string;
  value: string;
}

interface AsyncStorageDebuggerModalProps {
  visible: boolean;
  onClose: () => void;
}

const AsyncStorageDebuggerModal: React.FC<AsyncStorageDebuggerModalProps> = ({ visible, onClose }) => {
  const [data, setData] = useState<KeyValueItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [text, onChangeText] = useState('');

  // 加载 AsyncStorage 数据
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const keys = await AsyncStorage.getAllKeys();

      if (keys.length === 0) {
        setData([]);
        setLoading(false);
        return;
      }

      const pairs = await AsyncStorage.multiGet(keys);
      const formatted: KeyValueItem[] = pairs.map(([key, value]) => ({ key, value }));
      setData(formatted);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const clearDataByKey = () => {
    AsyncStorage.removeItem(text)
    loadData();
  }
  // 组件挂载或 visible 变化时加载数据
  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const renderItem = ({ item }: { item: KeyValueItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.keyText}>🔑 {item.key}</Text>
      <Text style={styles.valueText} numberOfLines={2} ellipsizeMode="tail">
        💾 {item.value}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>🔍 AsyncStorage 调试器</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text>加载中...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
          </View>
        )}

        {!loading && !error && data.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📦 暂无数据</Text>
          </View>
        )}
        <View style={styles.clearBox}>
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeText}
            value={text}
          />
          <Button
            title="clear"
            onPress={clearDataByKey}
          />
        </View>
        {!loading && !error && data.length > 0 && (
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.key}-${index}`}
            style={styles.list}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};

// 🎨 样式
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#999',
  },
  clearBox: {
    display: 'flex',
    flexDirection: 'row',
  },
  textInput: {
    width: 100,
    borderWidth: 1,
    borderColor: '#eee'
  },
  list: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  keyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  valueText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#888',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default AsyncStorageDebuggerModal;
