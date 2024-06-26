import React, { ReactElement } from 'react';
import { RelationshipStatus, User, UserAccount } from '../types';
import { Card } from 'antd';
import styles from './HeaderProfile.module.css';
import UserAvatar from '../chrome/UserAvatar';
import { FromTitle } from '../content/FromTitle';
import GraphChangeButton from '../network/GraphChangeButton';
import ConnectionsList from '../network/ConnectionsList';

interface HeaderProfileProps {
  account: UserAccount;
  user?: User;
  accountFollowing: string[];
  triggerGraphRefresh: () => void;
  goToProfile: (msaId?: string) => void;
}

export const HeaderProfile = ({
  user,
  account,
  accountFollowing,
  triggerGraphRefresh,
  goToProfile,
}: HeaderProfileProps): ReactElement => {
  // Default to the account if no user
  user = user || account;
  const secondary = user?.profile?.name || '';

  return (
    <div className={styles.root}>
      <Card.Meta
        className={styles.metaInnerBlock}
        avatar={<UserAvatar user={user} avatarSize={'medium'} />}
        title={<FromTitle level={2} user={user} />}
      />
      <div className={styles.profile}>{secondary ? secondary : 'No Profile'}</div>
      {account.msaId !== user.msaId && (
        <GraphChangeButton
          key={accountFollowing.length}
          user={user}
          triggerGraphRefresh={triggerGraphRefresh}
          relationshipStatus={
            accountFollowing.includes(user.msaId) ? RelationshipStatus.FOLLOWING : RelationshipStatus.NONE
          }
        />
      )}
      <ConnectionsList
        goToProfile={goToProfile}
        triggerGraphRefresh={triggerGraphRefresh}
        account={account}
        accountFollowing={accountFollowing || []}
        graphRootUser={user}
      />
    </div>
  );
};
