import React, { LegacyRef, ReactElement, useEffect } from 'react';
import { Button, Modal, Input, Form } from 'antd';
import UserAvatar from '../chrome/UserAvatar';
import NewPostImageUpload from './NewPostImageUpload';
import type { User } from '../types';
import type { UploadFile } from 'antd/es/upload/interface';
import * as dsnpLink from '../dsnpLink';
import { getContext } from '../service/AuthService';
import FormData from 'form-data';
import { makeDisplayHandle } from '../helpers/DisplayHandle';
import styles from '../NewPost.module.css';
import { TextAreaRef } from 'antd/es/input/TextArea';

interface NewPostProps {
  onSuccess: () => void;
  onCancel: () => void;
  loggedInAccount: User;
}

type NewPostValues = {
  message: string;
  test?: string;
  images: UploadFile[];
};

const NewPostModal = ({ onSuccess, onCancel, loggedInAccount }: NewPostProps): ReactElement => {
  const [form] = Form.useForm();
  const [saving, setSaving] = React.useState<boolean>(false);

  const messageRef: LegacyRef<TextAreaRef> = React.createRef();

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.focus();
    }
  }, [messageRef]);

  const success = () => {
    setSaving(false);
    onSuccess();
  };

  const createPost = async (formValues: NewPostValues) => {
    try {
      const body = new FormData();
      body.append('content', formValues.message);
      (formValues.images || []).forEach((upload) => {
        if (upload.originFileObj) body.append('files', upload.originFileObj);
      });

      const { assetIds } = await dsnpLink.postAssetsHandler(getContext(), {}, body);
      const response = await dsnpLink.postBroadcastHandler(
        getContext(),
        {},
        {
          content: formValues.message,
          assets: assetIds,
        }
      );

      console.log('postBroadcastHandler', { response });
      success();
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
  };

  return (
    <Modal
      title={<div className={styles.title}>New Post</div>}
      open={true}
      onCancel={onCancel}
      footer={null}
      centered={true}
    >
      <Form form={form} onFinish={createPost}>
        <Form.Item>
          <UserAvatar user={loggedInAccount} avatarSize={'small'} />
          <span className={styles.fromTitle}>Posting as @{makeDisplayHandle(loggedInAccount.handle)}</span>
        </Form.Item>
        <Form.Item name="message" required={true}>
          <Input.TextArea rows={4} placeholder="Enter your message" autoFocus={true} ref={messageRef} />
        </Form.Item>
        <NewPostImageUpload
          onChange={(fileList) => {
            form.setFieldsValue({ images: fileList });
            form.validateFields(['images']);
          }}
        />
        <Form.Item>
          <Button size={'large'} type={'primary'} className={styles.newPostButton} htmlType="submit" loading={saving}>
            Post
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewPostModal;