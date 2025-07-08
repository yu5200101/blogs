// src/components/FormPreview/FormPreview.tsx
import React from 'react';
import styles from './index.module.scss';

interface FormPreviewProps {
  config: any;
}

const FormPreview: React.FC<FormPreviewProps> = ({ config }) => {
  return (
    <div className={styles.jsonPreview}>
      <h3>JSON配置预览</h3>
      <pre>{JSON.stringify(config, null, 2)}</pre>
    </div>
  );
};

export default FormPreview;