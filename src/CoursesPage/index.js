import { useNavigate} from "react-router-dom";
import styles from './index.module.css';
import React, { useState } from "react"
import {Typography, Divider, Button, Input, List, InputNumber, Descriptions} from '@douyinfe/semi-ui';
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
        navigate(`/callRoll`)
    }
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