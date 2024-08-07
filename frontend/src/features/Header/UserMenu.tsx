import React, { ReactElement } from 'react';
import { Button } from 'antd';
import styles from './UserMenu.module.css';

interface UserMenuProps {
  logout: () => void;
}

const UserMenu = ({ logout }: UserMenuProps): ReactElement => {
  return (
    <Button className={styles.button} aria-label="Logout" onClick={logout}>
      Sign Out
    </Button>
  );
};

export default UserMenu;
