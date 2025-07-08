// src/types.ts
// 定义字段选项类型（用于单选和多选）
export interface FieldOption {
  label: string;
  value: string;
}

// 定义字段类型
export type FieldType = 'text' | 'textarea' | 'radio' | 'checkbox';

// 定义基础字段接口
export interface BaseField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  errorMessage?: string;
}

// 定义不同类型的字段的特定属性
export interface TextField extends BaseField {
  type: 'text' | 'textarea';
  placeholder?: string;
  pattern?: string;
  maxLength?: number;
}

export interface RadioField extends BaseField {
  type: 'radio';
  options: FieldOption[];
}

export interface CheckboxField extends BaseField {
  type: 'checkbox';
  options: FieldOption[];
}

// 联合所有字段类型
export type FormField = TextField | RadioField | CheckboxField;

// 定义整个表单配置
export interface FormConfig {
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
}

// 定义表单数据类型
export type FormData = Record<string, string | string[]>;

// 定义错误类型
export type FormErrors = Record<string, string>;