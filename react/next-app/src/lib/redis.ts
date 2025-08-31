// redis.ts
import Redis from 'ioredis';

// 定义 Note 的数据结构
interface Note {
  title: string;
  content: string;
  updateTime: string; // ISO 8601 格式字符串
}

// 初始数据：key 是 string，value 是序列化后的 JSON 字符串
const initialData: Record<string, string> = {
  "1702459181837": JSON.stringify({
    title: "sunt aut",
    content: "quia et suscipit suscipit recusandae",
    updateTime: "2023-12-13T09:19:48.837Z"
  }),
  "1702459182837": JSON.stringify({
    title: "qui est",
    content: "est rerum tempore vitae sequi sint",
    updateTime: "2023-12-13T09:19:48.837Z"
  }),
  "1702459188837": JSON.stringify({
    title: "ea molestias",
    content: "et iusto sed quo iure",
    updateTime: "2023-12-13T09:19:48.837Z"
  })
};

// 创建 Redis 客户端实例
// const redis = new Redis();
const redis = new Redis(process.env.REDIS_URL)

/**
 * 获取所有笔记
 * 如果 Redis 中没有数据，则初始化写入初始数据
 */
export async function getAllNotes(): Promise<Record<string, string>> {
  const data = await redis.hgetall("notes");
  if (Object.keys(data).length === 0) {
    // 写入初始数据
    await redis.hset("notes", initialData);
  }
  return await redis.hgetall("notes");
}

/**
 * 添加新笔记
 * @param data 必须是已经序列化的 JSON 字符串，格式同 Note
 * @returns 返回生成的 UUID（即 key）
 */
export async function addNote(data: string): Promise<string> {
  const uuid = Date.now().toString();
  await redis.hset("notes", { [uuid]: data });
  return uuid;
}

/**
 * 更新指定 UUID 的笔记
 * @param uuid 笔记的唯一标识
 * @param data 序列化后的 JSON 字符串
 */
export async function updateNote(uuid: string, data: string): Promise<void> {
  await redis.hset("notes", { [uuid]: data });
}

/**
 * 获取单个笔记（返回的是 JSON 字符串，需要调用方解析）
 * @param uuid 笔记的唯一标识
 * @returns 返回序列化的 JSON 字符串，或 null（如果不存在）
 */
export async function getNote(uuid: string): Promise<string | null> {
  return await redis.hget("notes", uuid);
}

/**
 * 解析并获取单个笔记对象（内部使用，方便调用方直接获取对象）
 * @param uuid
 * @returns 解析后的 Note 对象，或 null
 */
export async function getNoteParsed(uuid: string): Promise<Note | null> {
  const jsonStr = await getNote(uuid);
  if (!jsonStr) return null;
  try {
    return JSON.parse(jsonStr) as Note;
  } catch (err) {
    console.error("Failed to parse note JSON:", err);
    return null;
  }
}

/**
 * 删除指定 UUID 的笔记
 * @param uuid
 * @returns 删除的字段数（0 或 1）
 */
export async function delNote(uuid: string): Promise<number> {
  return await redis.hdel("notes", uuid);
}

// 导出 Redis 客户端实例（可根据需要）
export default redis;
