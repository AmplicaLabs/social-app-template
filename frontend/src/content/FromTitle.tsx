import React, { ReactElement } from 'react';
import { User } from '../types';
import styles from './FromTitle.module.css';
import Title from 'antd/es/typography/Title';

interface FromTitleProps {
  user: User;
  level?: 1 | 2 | 3 | 4;
  goToProfile?: (msaId: string) => void;
  isReply?: boolean;
}

export const FromTitle = ({ user, goToProfile, isReply, level }: FromTitleProps): ReactElement => {
  const primary = user.handle;
  const secondary = user?.profile?.name || '';

  return (
    <div onClick={() => (goToProfile ? goToProfile(user.msaId) : '')} className={styles.root}>
      {level && (
        <Title style={{ margin: 0 }} level={level}>
          {primary}
        </Title>
      )}
      {!level && primary}
      {!isReply && <div>{secondary}</div>}
    </div>
  );
};
