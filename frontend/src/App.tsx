import React, { ReactElement, useState } from 'react';
import styles from './App.module.css';

import useStickyState from './helpers/StickyState';

import * as dsnpLink from './dsnpLink';
import { Network, UserAccount } from './types';
import Header from './chrome/Header';
import { Col, ConfigProvider, Layout, Modal, Row, Spin } from 'antd';
import { setAccessToken } from './service/AuthService';
import { Content } from 'antd/es/layout/layout';
import { setIpfsGateway } from './service/IpfsService';
import AuthErrorBoundary from './AuthErrorBoundary';
import FrequencyWaves from './style/frequencyWaves.svg';
import FeedNav from './content/FeedNav';
import { BrowserRouter } from 'react-router-dom';
import PageRoutes from './PageRoutes';
import LoginModal from './chrome/LoginModal';

const App = (): ReactElement => {
  const [loggedInAccount, setLoggedInAccount] = useStickyState<UserAccount | undefined>(undefined, 'user-account');
  const [loading, setLoading] = useState<boolean>(false);
  const [network, setNetwork] = useState<Network>('testnet');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(Date.now());
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  if (loggedInAccount) {
    setAccessToken(loggedInAccount.accessToken, loggedInAccount.expires);
  }

  const handleLogin = async (account: UserAccount, providerInfo: dsnpLink.ProviderResponse) => {
    setLoading(true);
    setAccessToken(account.accessToken, account.expires);
    providerInfo.ipfsGateway && setIpfsGateway(providerInfo.ipfsGateway);
    setNetwork(providerInfo.network);
    setLoggedInAccount(account);
    setLoading(false);
  };

  const handleLogout = () => {
    setLoggedInAccount(undefined);
  };

  const handleIsPosting = () => {
    setIsPosting(true);
    setTimeout(() => {
      setRefreshTrigger(Date.now());
      setIsPosting(false);
    }, 14_000);
  };

  const handleCancel = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5E69FF',
          colorSuccess: '#29fd47',
          colorWarning: '#ff7f0e',
          colorInfo: '#5E69FF',
          fontFamily: 'Poppins, Newake',
        },
      }}
    >
      <BrowserRouter>
        <Layout className={styles.root}>
          <Header
            loggedInAccount={loggedInAccount}
            logout={handleLogout}
            login={(account: UserAccount, providerInfo: dsnpLink.ProviderResponse) =>
              handleLogin(account, providerInfo)
            }
          />
          <div className={styles.block}>
            <Content className={styles.content}>
              <Spin spinning={loading}>
                <Row gutter={20}>
                  <Col span={6}>
                    <FeedNav loggedInAccount={loggedInAccount} handleIsPosting={handleIsPosting} />
                  </Col>
                  <Col span={18}>
                    <AuthErrorBoundary onError={() => setLoggedInAccount(undefined)}>
                      <PageRoutes
                        loggedInAccount={loggedInAccount}
                        network={network}
                        isPosting={isPosting}
                        refreshTrigger={refreshTrigger}
                        showLoginModal={() => setIsLoginModalOpen(true)}
                      />
                    </AuthErrorBoundary>
                  </Col>
                </Row>
              </Spin>
            </Content>
            <LoginModal open={isLoginModalOpen} onLogin={handleLogin} handleCancel={handleCancel} />
          </div>
          <img src={FrequencyWaves} alt={'Frequency Waves'} className={styles.waves} />
        </Layout>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
