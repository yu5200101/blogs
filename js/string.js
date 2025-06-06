function underscoreToCamel(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj; // 基本类型或null直接返回
  }

  if (Array.isArray(obj)) {
    return obj.map(item => underscoreToCamel(item)); // 处理数组
  }

  const camelObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // 转换键名：下划线后的小写字母转大写并移除下划线 函数中_指匹配到的值
      const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
      // 递归处理值
      camelObj[camelKey] = underscoreToCamel(obj[key]);
    }
  }
  return camelObj;
}

const obj = {
  user_id: 1,
  user_info: {
    first_name: 'John',
    last_name: 'Doe',
    phone_numbers: ['123-456-7890', '456-789-0123']
  },
  created_at: new Date()
};

console.log(underscoreToCamel(obj));
/* 输出：
{
  userId: 1,
  userInfo: {
    firstName: 'John',
    lastName: 'Doe',
    phoneNumbers: ['123-456-7890', '456-789-0123']
  },
  createdAt: Date对象
}
*/