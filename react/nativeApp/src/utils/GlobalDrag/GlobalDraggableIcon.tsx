// GlobalDraggableIcon.tsx代码如下
import React, { useState, useRef  } from 'react';
import { View, PanResponder, Animated, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import AsyncStorageDebuggerModal from './AsyncStorageDebuggerModal'; // 引入独立组件

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GlobalDraggableIcon = () => {
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

  const pan = useRef(new Animated.ValueXY()).current;

  const position = useRef({ x: 0, y: 0 }).current; // 用于记录按下的起始位置

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 只要有一点移动就响应拖动
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: (evt) => {
        // 记录初始点击位置
        position.x = evt.nativeEvent.locationX;
        position.y = evt.nativeEvent.locationY;
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (e, gesture) => {
        // 先释放偏移
        pan.flattenOffset();

        // 判断是否是点击（几乎没移动）
        const distance = Math.sqrt(gesture.dx ** 2 + gesture.dy ** 2);

        if (distance < 10) {
          // 👉 被认为是点击，打开弹窗
          setModalVisible(true);
        }
      },
    })
  ).current;

  const handleIconPress = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* 悬浮图标 - 只使用 PanResponder，不再用 TouchableOpacity */}
      <Animated.View
        style={[
          styles.floatingIcon,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
            zIndex: 1000,
          },
        ]}
        {...panResponder.panHandlers} // 👈 拖动 + 点击手势都绑定到这里
      >
        <View style={styles.iconContainer}>
          <Text style={styles.iconText}>+</Text>
        </View>
      </Animated.View>

      {/* ✅ Modal 弹窗：展示调试内容 */}
      <AsyncStorageDebuggerModal visible={isModalVisible} onClose={closeModal} />
    </>
  )
};
// 样式部分
const styles = StyleSheet.create({
  floatingIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  iconText: {
    fontSize: 30,
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
export default GlobalDraggableIcon;
