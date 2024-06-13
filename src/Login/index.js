import styles from './index.module.css';
import React, { useState, useEffect } from 'react';
import { Typography, Divider, Button, Input } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import http from '../http';
import '../globalStyles.css';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  function isSucceed() {
    if (isLogin) {
      const login = new Promise((resolve, reject) => {
        http
          .post('/teacher/login', {
            username: inputValue,
            password: inputValue2,
          })
          .then(res => {
            if (res.status === 200) {
              localStorage.setItem('token', res.data.token);
              navigate('/Courses');
            }
          })
          .catch(() => setIsPrint(true));
      });
    } else {
      const register = new Promise((resolve, reject) => {
        http
          .post('/teacher/register', {
            username: inputValue,
            password: inputValue2,
          })
          .then(res => {
            if (res.status === 200) {
              setIsLogin(true);
              location.reload();
            }
          })
          .catch(() => setIsPrint(true));
      });
    }
  }

  const { Title, Text } = Typography;
  const [isPrint, setIsPrint] = useState(false);
  const [inputValue, setInputValue] = useState();
  const [inputValue2, setInputValue2] = useState();
  const [isEmpty, setIsEmpty] = useState(false);
  useEffect(() => {
    setIsEmpty(!inputValue || !inputValue2);
  }, [inputValue, inputValue2]);

  return (
    <React.StrictMode>
      <div className={styles.backGround}>
        <div className={styles.App}>
          <img className={styles.logo} src="logo.svg" alt="logo" />
          <header className={styles.AppHeader}>
            <div className={styles.firstPart}>
              <Title heading={2}>
                欢迎{isLogin ? '登录' : '注册'}教师点名系统
              </Title>
            </div>
            <div className={styles.secondPart}>
              <Input
                autoFocus
                value={inputValue}
                id="inputField"
                className="input"
                placeholder="账户"
                onChange={newInputValue => {
                  setInputValue(newInputValue);
                  console.log(newInputValue);
                }}
              ></Input>
              <Input
                value={inputValue2}
                className="input"
                placeholder="密码"
                mode="password"
                onChange={newInputValue => {
                  setInputValue2(newInputValue);
                  console.log(newInputValue);
                }}
              ></Input>
            </div>
            <div className={styles.thirdPart}>
              <Button
                onClick={isSucceed}
                disabled={isEmpty}
                size="large"
                className={styles.button}
              >
                {isLogin ? '登录' : '注册'}
              </Button>
              <Title heading={6} type="quaternary">
                {isLogin ? '如果您还未注册账号请点击这里' : '已有账号'}
                <Button
                  onClick={() => setIsLogin(!isLogin)}
                  theme="borderless"
                  size="large"
                  style={{ marginRight: 8 }}
                >
                  {isLogin ? '注册' : '登录'}
                </Button>
              </Title>

              <Text type="danger">
                {isPrint ? '登陆失败，请检查账户和密码' : ''}
              </Text>
            </div>
            <Divider className={styles.Divider} />
          </header>
        </div>
      </div>
    </React.StrictMode>
    // document.getElementById('root')
  );
}

export default Login;
