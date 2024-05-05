import React, { useState, useEffect } from 'react';
import { Tabs, TabPane, Spin, List, Divider, Descriptions, Button, Modal ,InputNumber, Typography } from '@douyinfe/semi-ui';
import axios from "axios";
import useSWR from "swr";
import styles from "../CoursesPage/index.module.css";
import {IconArrowLeft, IconEdit} from "@douyinfe/semi-icons";
import { useNavigate, useLocation } from "react-router-dom";
import _ from "lodash"
import ListItem from "@douyinfe/semi-ui/lib/es/list/item";


function Students({students, isGroup, changePointsButton, course}){
    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
        margin: '8px 2px',
    };
    return(
        <>
            {Array.isArray(students) ? (
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
                                <h3 style={{ color: 'var(--semi-color-text-0)', fontWeight: 500 }}>{ !isGroup && item.isCall ? '😇' : ''}{item.name}</h3>
                                { changePointsButton ? <InputNumber defaultValue={item.points} onChange={num=>{
                                    fetch(`http://localhost:4000/${course}/${item.id}`, {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ points: num }), // 将 points 设置为一个数值
                                    })}}/> :
                                    <Descriptions
                                    align="center"
                                    size="small"
                                    row
                                    data={[
                                        {key: '分数', value: item.points}
                                    ]}
                                />}
                            </div>
                        </List.Item>
                    )}
                />
            ) : (
                <Spin />
            )}
        </>
    )
}


function App(){
    const location = useLocation();
    const course = location.state;
    const [modalOpen, setModalOpen] = useState(false);
    const [randomStudent, setRandomStudent] = useState()
    const [randomStudentPoints, setRandomStudentPoints] = useState()
    const [numStudentsChoose, setNumStudentsChoose] = useState()
    const [studentsNotCall, setStudentsNotCall] = useState()
    const [groupNum, setGroupNum] = useState(2)  //小组人员数量
    const [isShowGroup, setIsShowGroup] = useState(false)
    const [isActive, setIsActive] = useState(false); //鼠标悬停变色
    const [changePointsButton, setChangePointsButton] = useState(false) //控制是否修改数据
    const [groupOfStudents, setGroupOfStudents] = useState([])
    const { data: students, error, isLoading, mutate } = useSWR(`http://localhost:4000/${course}`, url=>
        axios.get(url).then(res=>res.data))
    const navigate = useNavigate()
    const { Title, Text } = Typography;


    function callName() {
        let numStudents = students.length;
        setModalOpen(true);
        mutate()
            .then(()=>{
                let randomNum = Math.floor(Math.random() * numStudents);

                console.log(students[1])

                while(students[randomNum]['isCall']){
                    randomNum = Math.floor(Math.random() * numStudents);
                }
                fetch(`http://localhost:4000/${course}/${randomNum}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ isCall: true }), // 将 points 设置为一个数值
                })
                setNumStudentsChoose(randomNum);
                setRandomStudent(students[randomNum]['name']);
                setRandomStudentPoints(students[randomNum]['points']);
                let studentsNotCall = numStudents
                for (let i = 0; i < numStudents; i++) {
                    if (students[i]['isCall']) {
                        studentsNotCall--
                    }
                }
                if (studentsNotCall === 1) {
                    for(let j = 0; j < numStudents; j++) {
                        fetch(`http://localhost:4000/${course}/${j}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({isCall: false})
                        })
                    }
                }
            })
    }

    const handleMouseDown = () => {
        setIsActive(true);
        console.log(course)
    };

    const handleMouseUp = () => {
        setIsActive(false);
    };

    const handleClick = () => {
        console.log("Clicked on arrow icon");
        navigate("/Courses");
    };

    function changePoints() {
        setModalOpen(false);
        const selectedStudent = students[numStudentsChoose]

        fetch(`http://localhost:4000/${course}/${numStudentsChoose}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ points: selectedStudent.points + 1 }), // 将 points 设置为一个数值
        })
            .then(response => response.json())
            .then(data => {console.log(data)
                mutate()});
    }
    function closeModal(){
        setModalOpen(false);
        mutate()
    }
    function makeGroup(){
        let studentsArray = []
        for(let i of students){
            studentsArray.push(i["name"])

        }
        studentsArray = _.shuffle(studentsArray)
        studentsArray = _.chunk(studentsArray, groupNum)
        setGroupOfStudents(studentsArray)
        setIsShowGroup(true)
    }
    const style = {
        border: '1px solid var(--semi-color-border)',
        backgroundColor: 'var(--semi-color-bg-2)',
        borderRadius: '3px',
        paddingLeft: '20px',
    };
    return (
        <div>
            <IconArrowLeft
                className={`${isActive ? styles.active : ''}`}
                onClick={()=>{handleClick()}}
                onMouseLeave={handleMouseUp}
                onMouseEnter={handleMouseDown}
            />
            <Button onClick={()=>{
                setChangePointsButton(!changePointsButton)
                mutate()}}
                    type="secondary"><IconEdit />{changePointsButton ? '确认分数': '修改分数'}</Button>
            <Title style={{ margin: '8px 0' }} > {course} </Title>
            <Tabs type="line">
                <TabPane tab={'点名'} itemKey={'1'}>
                    <Students
                    students={students}
                    isGroup={false}
                    changePointsButton={changePointsButton}
                    course={course}/>
                    <Button theme='solid' type='primary' style={{ marginRight: 8 }} onClick={callName} disabled={changePointsButton}>随机点名</Button>
                    <Modal
                        title="幸运儿"
                        visible={modalOpen}
                        footerFill={true}
                        onOk={changePoints}
                        onCancel={closeModal}
                        okText={'加分!'}
                        cancelText={'答错了'}
                        maskClosable={false}
                        motion
                    >
                        {randomStudent}
                        <br/>
                        当前分数：{randomStudentPoints}分
                        {/*<InputNumber min={1} max={10} defaultValue={1} onchange={newValue=>{setChangeScoreValue(newValue)}}/>*/}
                    </Modal>
                </TabPane>

                <TabPane tab={'分组'} itemKey={'2'}>
                    <Students
                        students={students}
                        isGroup={true}
                        course={course}/>
                    <Text>每组人数：</Text>
                    <InputNumber min={2} max={6} step={1} defaultValue={2} onChange={num=>{setGroupNum(num)}}/>
                    <Button theme='solid' type='primary' style={{marginRight: 8}} onClick={makeGroup}>随机分组</Button>

                    {isShowGroup?<List
                        grid={{
                            gutter: 12,
                            span: 6,
                        }}
                        bordered
                        dataSource={groupOfStudents}
                        renderItem={item=>(
                            <List.Item style={style}>
                                <div>
                                    <List
                                        dataSource={item}
                                        renderItem={item => (<List.Item>{item}</List.Item>)}
                                    />
                                    <Divider/>
                                </div>
                            </List.Item>
                        )}

                    />:''}
                </TabPane>
            </Tabs>
        </div>
    )


}

export default App;