// src/App.tsx
import React from 'react';
import FormGenerator from './components/FormGenerator/FormGenerator';
import FormPreview from './components/FormPreview/FormPreview';
import type { FormConfig, TextField, RadioField, CheckboxField } from './types';
import styles from './index.module.scss';

const App: React.FC = () => {
  // JSON表单配置
  const formConfig: FormConfig = {
    title: "用户信息表单",
    description: "请填写您的个人信息，带*号为必填项",
    fields: [
      {
        id: "username",
        label: "用户名",
        type: "text",
        required: true,
        placeholder: "请输入4-16位字母数字",
        pattern: "^[a-zA-Z0-9]{4,16}$",
        errorMessage: "用户名必须是4-16位字母数字组合"
      } as TextField,
      {
        id: "email",
        label: "电子邮箱",
        type: "text",
        required: true,
        placeholder: "请输入有效邮箱地址",
        pattern: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
        errorMessage: "请输入有效的邮箱地址"
      } as TextField,
      {
        id: "gender",
        label: "性别",
        type: "radio",
        required: true,
        options: [
          { label: "男", value: "male" },
          { label: "女", value: "female" },
          { label: "其他", value: "other" }
        ],
        errorMessage: "请选择您的性别"
      } as RadioField,
      {
        id: "interests",
        label: "兴趣爱好",
        type: "checkbox",
        required: false,
        options: [
          { label: "阅读", value: "reading" },
          { label: "运动", value: "sports" },
          { label: "音乐", value: "music" },
          { label: "旅游", value: "travel" }
        ]
      } as CheckboxField,
      {
        id: "bio",
        label: "个人简介",
        type: "textarea",
        required: false,
        placeholder: "请简要介绍你自己...",
        maxLength: 200
      } as TextField
    ],
    submitText: "提交表单"
  };

  // 表单提交处理
  const handleSubmit = (formData: any, isValid: boolean) => {
    if (isValid) {
      alert(`表单提交成功!\n${JSON.stringify(formData, null, 2)}`);
    } else {
      alert("请正确填写所有必填字段");
    }
  };

  return (
    <div>
      <div className={styles.appContainer}>
        <h1 className={styles.header}>JSON表单生成器 (TypeScript + SCSS模块化)</h1>
        <p className={styles.subtitle}>动态生成表单元素，支持必填验证和正则校验</p>
        
        <div className={styles.content}>
          <div className={styles.formSection}>
            <div className={styles.formContainer}>
              <FormGenerator config={formConfig} onSubmit={handleSubmit} />
            </div>
          </div>
          
          <div className={styles.previewSection}>
            <FormPreview config={formConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;