import './App.css';
import * as ReactDOM from "react-dom/client";
import React, { useState, useEffect } from 'react';
import { Input } from '@douyinfe/semi-ui';
import { Typography } from '@douyinfe/semi-ui';
import { Button } from '@douyinfe/semi-ui';
import { useNavigate} from "react-router-dom";

function Login() {
    const navigate = useNavigate()
    function isSucceed(){
        const login = new Promise((resolve, reject) => {
            if (Math.random() < 0.5) {
                resolve('成功')
            }
            else {
                reject('失败')
            }
        })
        login
            .then(value => {
                console.log(value)

                navigate("/callRoll")

            })
            .catch(error => {
                console.log(error)
            })
    }

    const { Title } = Typography;
    const [inputValue, setInputValue] = useState();
    const [inputValue2, setInputValue2] = useState();
    const [isEmpty, setIsEmpty] = useState(false);
    useEffect(() => {
        setIsEmpty(!inputValue || !inputValue2)
    }, [inputValue, inputValue2]);
    return (
        <div className="App">
            <header className="App-header">
                <Title style={{ margin: '8px 0' }} >欢迎登陆教师点名系统</Title>
                <Input
                    autoFocus
                    value={inputValue}
                    id="inputField"
                    className="input"
                    placeholder='账户'
                    onChange={newInputValue=>{
                        setInputValue(newInputValue)
                        console.log(newInputValue)

                    }}>
                </Input>
                <Input
                    value={inputValue2}
                    className="input"
                    placeholder='密码'
                    mode="password"
                    onChange={newInputValue=>{
                        setInputValue2(newInputValue)
                        console.log(newInputValue)
                    }}>

                </Input>
                <Button
                    onClick={isSucceed}
                    disabled={isEmpty}
                >登录</Button>
                <Title heading={ 6 } style={{ margin: '8px 0'}}>如果您还未注册账号请点击这里<a>注册</a></Title>
            </header>
        </div>
    );
}

export default Login;
