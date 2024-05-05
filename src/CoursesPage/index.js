import { useNavigate} from "react-router-dom";
import styles from './index.module.css';
import React, { useState } from "react"
import {Typography, Divider, Modal, Button, Input, List, InputNumber, Descriptions} from '@douyinfe/semi-ui';
import { IconArrowLeft } from '@douyinfe/semi-icons';
import useSWR from "swr";
import axios from "axios";
import callRoll from "../CallRoll";

function AddCourse() {
    const navigate = useNavigate()
    const [isActive, setIsActive] = useState(false); // 新增状态来控制样式
    const { Title, Text } = Typography;
    const { data: students, error, isLoading, mutate } = useSWR("http://localhost:4000/CoursesList", url=>
        axios.get(url).then(res=>res.data))
    const [visible, setVisible] = useState(false);  //modal是否可见
    const [newName, setNewName] = useState();

    const handleMouseDown = () => {
        setIsActive(true);
    };

    const handleMouseUp = () => {
        setIsActive(false);
    };

    const handleClick = () => {
        navigate("/Login");
    };
    const enterCallRoll = (paramValue) => {
        navigate(`/callRoll`, { state: paramValue.name })
    }
    const addCourse = () =>{
        setVisible(true);
    }
    const handleOk = () => {
        setVisible(false);
        fetch('http://localhost:4000/CoursesList', {
            method: 'POST', // 请求方法
            headers: {
                'Content-Type': 'application/json', // 设置内容类型
            },
            body: JSON.stringify({"name": newName}), // 将JavaScript对象转换为JSON字符串
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                mutate()
            })
    };
    const handleCancel = () => {
        setVisible(false);
        console.log('Cancel button clicked');
    };

    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        margin: '8px 2px',
    };
    return(
        <div>
            <IconArrowLeft
                className={`${styles.arrowIcon} ${isActive ? styles.active : ''}`}
                onClick={()=>{handleClick()}}
                onMouseLeave={handleMouseUp}
                onMouseEnter={handleMouseDown}
            />
            <Title heading={3} style={{ margin: '8px 0' }} >请选择您的课程</Title>
            <Button onClick={addCourse}>+ 新建课程</Button>
            <Modal
                visible={visible}
                title="新建课程"
                motion={true}
                okText="新建"
                onCancel={handleCancel}
                onOk={handleOk}
                maskClosable={false}
            >
                <Input placeholder="课程名称" onChange={text=>{setNewName(text)}}></Input>
            </Modal>
            <List
                grid={{
                    gutter: 12,
                    xs: 0,
                    sm: 0,
                    md: 12,
                    lg: 8,
                    xl: 8,
                    xxl: 6,
                }}
                dataSource={students}
                renderItem={item => (
                    <List.Item style={style}>
                        <div>
                            <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}> {item.name} </h3>
                                <Descriptions
                                    align="center"
                                    size="small"
                                    row
                                />
                            <Button onClick={()=>{enterCallRoll(item)}}>进入课程</Button>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}

export default AddCourse;