import styles from './index.module.css';
import React, { useState, useEffect } from 'react';
import { Typography, Divider, Button, Input } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import http from '../http';

function Login() {
  const navigate = useNavigate();
  function isSucceed() {
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
    <div className={styles.Page}>
      <div className={styles.App}>
        <img className={styles.logo} src="logo.svg" alt="logo" />
        <header className={styles.AppHeader}>
          <div className={styles.firstPart}>
            <Title heading={2}>欢迎登陆教师点名系统</Title>
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
            <Button onClick={isSucceed} disabled={isEmpty}>
              登录
            </Button>
            <Title heading={6} type="quaternary">
              如果您还未注册账号请点击这里<a>注册</a>
            </Title>

            <Text type="danger">
              {isPrint ? '登陆失败，请检查账户和密码' : ''}
            </Text>
          </div>
          <Divider className={styles.Divider} />
        </header>
      </div>
    </div>
  );
}

export default Login;
