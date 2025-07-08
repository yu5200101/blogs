// src/components/FormGenerator/FormGenerator.tsx
import React, { useState } from 'react';
import styles from './index.module.scss';
import type { FormConfig, FormField, FormData, FormErrors, TextField, RadioField, CheckboxField } from '../../types';

interface FormGeneratorProps {
  config: FormConfig;
  onSubmit: (formData: FormData, isValid: boolean) => void;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({ config, onSubmit }) => {
  // 初始化表单数据
  const initialFormData: FormData = {};
  const initialErrors: FormErrors = {};
  
  config.fields.forEach(field => {
    if (field.type === 'checkbox') {
      initialFormData[field.id] = [];
    } else {
      initialFormData[field.id] = '';
    }
    initialErrors[field.id] = '';
  });

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>(initialErrors);

  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: FormField) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement; // 用于处理checkbox的checked属性
    
    if (type === 'checkbox') {
      const checkboxField = field as CheckboxField;
      setFormData(prev => ({
        ...prev,
        [name]: target.checked 
          ? [...(prev[name] as string[]), value] 
          : (prev[name] as string[]).filter(item => item !== value)
      }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // 清除当前字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // 表单验证
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: FormErrors = { ...errors };
    
    config.fields.forEach(field => {
      const value = formData[field.id];
      
      // 必填验证
      if (field.required) {
        if (field.type === 'checkbox') {
          if ((value as string[]).length === 0) {
            newErrors[field.id] = field.errorMessage || '此项为必填项';
            isValid = false;
          }
        } else {
          if (!(value as string).trim()) {
            newErrors[field.id] = field.errorMessage || '此项为必填项';
            isValid = false;
          }
        }
      }
      
      // 正则验证
      if (value && field.type !== 'checkbox' && field.type !== 'radio' && (field as TextField).pattern) {
        const textField = field as TextField;
        const regex = new RegExp(textField.pattern as string);
        if (!regex.test(value as string)) {
          newErrors[field.id] = textField.errorMessage || '格式不正确';
          isValid = false;
        }
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // 提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    onSubmit(formData, isValid);
  };

  // 渲染字段
  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'textarea':
        const textField = field as TextField;
        return (
          <div className={`${styles.formGroup} ${errors[field.id] ? styles.error : ''}`}>
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                name={field.id}
                value={formData[field.id] as string}
                onChange={(e) => handleChange(e, field)}
                placeholder={textField.placeholder}
                maxLength={textField.maxLength || 500}
                className={errors[field.id] ? styles.errorInput : ''}
              />
            ) : (
              <input
                type="text"
                id={field.id}
                name={field.id}
                value={formData[field.id] as string}
                onChange={(e) => handleChange(e, field)}
                placeholder={textField.placeholder}
                className={errors[field.id] ? styles.errorInput : ''}
              />
            )}
            {errors[field.id] && <div className={styles.errorMessage}>{errors[field.id]}</div>}
          </div>
        );
      
      case 'radio':
        const radioField = field as RadioField;
        return (
          <div className={`${styles.formGroup} ${errors[field.id] ? styles.error : ''}`}>
            <label>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.radioGroup}>
              {radioField.options.map(option => (
                <div key={option.value} className={styles.radioOption}>
                  <input
                    type="radio"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={formData[field.id] === option.value}
                    onChange={(e) => handleChange(e, field)}
                  />
                  <label htmlFor={`${field.id}-${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>
            {errors[field.id] && <div className={styles.errorMessage}>{errors[field.id]}</div>}
          </div>
        );
      
      case 'checkbox':
        const checkboxField = field as CheckboxField;
        return (
          <div className={`${styles.formGroup} ${errors[field.id] ? styles.error : ''}`}>
            <label>
              {field.label}
              {field.required && <span className={styles.required}>*</span>}
            </label>
            <div className={styles.checkboxGroup}>
              {checkboxField.options.map(option => (
                <div key={option.value} className={styles.checkboxOption}>
                  <input
                    type="checkbox"
                    id={`${field.id}-${option.value}`}
                    name={field.id}
                    value={option.value}
                    checked={(formData[field.id] as string[]).includes(option.value)}
                    onChange={(e) => handleChange(e, field)}
                  />
                  <label htmlFor={`${field.id}-${option.value}`}>{option.label}</label>
                </div>
              ))}
            </div>
            {errors[field.id] && <div className={styles.errorMessage}>{errors[field.id]}</div>}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.dynamicForm}>
      <div className={styles.formHeader}>
        <h2>{config.title}</h2>
        {config.description && <p className={styles.formDescription}>{config.description}</p>}
      </div>
      
      {config.fields.map(field => (
        <div key={field.id} className={styles.fieldContainer}>
          {renderField(field)}
        </div>
      ))}
      
      <div className={styles.formFooter}>
        <button type="submit" className={styles.submitButton}>
          {config.submitText || '提交'}
        </button>
      </div>
    </form>
  );
};

export default FormGenerator;